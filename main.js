// Declare mqttConfig globally
		let mqttConfig = {};

		// import config.ini
		fetch('config.ini')
			.then(response => response.text())
			.then(data => {
				const config = {};
				data.split('\n').forEach(line => {
					const [key, value] = line.split('=').map(item => item && item.trim());
					if (key && value) {
						config[key] = value;
					}
				});
				mqttConfig = config;

				console.log('Config loaded:', mqttConfig);

				// center: "35.11151,-78.913783"

				// convert center coordinates to float and zoom level to integer
				if (mqttConfig.center) {
					const [lat, lon] = mqttConfig.center.split(',').map(coord => parseFloat(coord.trim()));
					mqttConfig.center_lat = lat;
					mqttConfig.center_lon = lon;
				}

				// Create a map object
				var map = L.map('map').setView([mqttConfig.center_lat, mqttConfig.center_lon], mqttConfig.default_zoom);

				// Set map options
				L.tileLayer(mqttConfig.tile_url, {
					maxZoom: 19,
					attribution: '&copy; <a href="' + mqttConfig.tile_attribution_url + '">' + mqttConfig.tile_attribution + '</a>'
				}).addTo(map);

				// Now that map and config are ready, continue with MQTT and other logic
				initMQTTandMarkers(map, mqttConfig);
			})
			.catch(error => {
				console.error('Error loading config.ini:', error);
			});

		// Import the users object with user details from users.json
		fetch('users.json')
			.then(response => response.json())
			.then(data => {
				users = data;
			})
			.catch(error => {
				console.error('Error loading users.json:', error);
			});

		// Move MQTT and marker logic into a function to be called after config and map are ready
		function initMQTTandMarkers(map, mqttConfig) {
			let client = mqtt.connect(`ws://${mqttConfig.host}:${mqttConfig.port}`, {
				username: mqttConfig.username,
				password: mqttConfig.password,
				clientId: mqttConfig.clientId
			});

			client.on('connect', function () {
				console.log('Connected to MQTT broker');
				document.getElementById('mqtt_status').innerText = 'Connected';
				document.getElementById('mqtt_status').style.color = 'green';
			});

			client.on('error', function (err) {
				console.error('Connection error:', err);
				document.getElementById('mqtt_status').innerText = 'Disconnected';
				document.getElementById('mqtt_status').style.color = 'red';
			});

			let topic = "owntracks/+/+";

			client.subscribe(topic);
			client.on('message', function (topic, message) {
				// message is Buffer
				let data = JSON.parse(message.toString());

				for (let user in users) {
					if (data._type === 'location' && data.tid === user) {
						// Define icons for each user
						let locationMarker = L.icon({
							iconUrl: users[user].icon,
							iconSize: [56, 56],
							iconAnchor: [28, 56],
							popupAnchor: [0, -76]
						});

						let markerIcon = locationMarker;
						let marker = L.marker([data.lat, data.lon], {
							icon: markerIcon,
							title: data.tst,
						}).addTo(map);

						let lastSeen = new Date(data.tst * 1000).toLocaleString();

						// find all markers for the user and remove all but the most recent one
						// This assumes that the title of the marker is set to the timestamp (tst)
						let existingMarkers = document.querySelectorAll(`.leaflet-marker-icon`);
						existingMarkers.forEach(element => {
							if (element.title < data.tst) {
								element.remove();
							}
						});

						// Close all existing popups for the user
						let existingPopups = document.querySelectorAll(`.leaflet-popup`);
						existingPopups.forEach(popup => {
							if (popup._source && popup._source.options.title === data.tst) {
								popup.remove();
							}
						});

						marker.bindPopup(`<b>${users[user].name}</b><br>Last Seen: ${lastSeen}<br>Battery: ${data.batt}%`);
						console.log(`Marker for ${users[user].name} updated:`, data);

						// stylize the marker based on the user
						marker.getElement().style.borderColor = users[user].color;
						marker.getElement().style.borderWidth = '2px';
						marker.getElement().style.borderStyle = 'solid';
						marker.getElement().style.borderRadius = '50%';
						marker.getElement().style.boxShadow = `0 0 10px ${users[user].color}`;

					}
				}
			});
		}