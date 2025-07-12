# Owntracks Webmap

Kicking Life360 to the curb?

Owntracks Webmap is a simple, self-hosted webmap for tracking your family and friends using the [Owntracks](https://owntracks.org/) app, available on iOS and Android.

Just like the map in the app, you can see an overview of your family and friends' locations, but in a web browser. This allows you to view the map on a larger screen, share it with others, or even embed it in your own website.

## Setup

You'll need an MQTT broker to connect to. You can use a public broker or set up your own using a service like [Mosquitto](https://mosquitto.org/).

You can also use a [Docker image](https://hub.docker.com/_/eclipse-mosquitto) to run Mosquitto via WebSockets, as the MQTT protocol isn't available in the browser. [@kingsor/mosquitto-compose](https://github.com/kingsor/mosquitto-compose) has a great example of how to set this up via Docker Compose.

In the app, set the MQTT broker URL to your broker's address, and make sure to enable WebSockets. The default port for WebSockets is `1883`, but if you are using a different port, make sure to update the port in [config.ini](config.ini), and the docker-compose file if you're using it.

As for the webmap itself, you can either clone this repository or download the latest release from the [releases page](https://github.com/lucasburlingham/owntracks-webmap/releases). It is a static website, so you can host it on any web server, or run it via GitHub Pages.

### Users

You can add users to the map by appending their information to the [users.json](users.json) file. The format is as follows:

```json
{
    "LB": {
        "name": "User1 Android",
        "icon": "profile.jpg",
        "color": "blue"
    },
    "MP": {
        "name": "User2 iPhone",
        "icon": "profile2.jpg",
        "color": "pink"
    }
}
```

"LB" and "MP" are the Owntracks device IDs, which you can find in the Owntracks app under "Settings > Device ID". The `name` is the display name for the user, `icon` is the filename of the user's profile picture (which should be placed in the same directory as [index.html](index.html)), and `color` is an optional color for the user's marker on the map, and can be any valid CSS color value (e.g., "red", `#ff0000`, `rgb(255,0,0)`).

## Disclaimer

This project is not affiliated with Owntracks or the developers of the Owntracks app. It is an independent project created to provide a web-based map for Owntracks users, and is not endorsed by Owntracks in any way. Use at your own risk.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

### Special Thanks

To [Leaflet.js](https://leafletjs.com/) for the awesome mapping library, and to [Owntracks](https://owntracks.org/) for their application, the [Meshtastic](https://meshtastic.org/) community for inspiration, and [OpenStreetMap](https://www.openstreetmap.org/) for the map tiles.

## Contributing

If you would like to contribute to this project, feel free to open an issue or submit a pull request. Contributions are welcome! Keep in mind that my vision for this project is to keep it simple and lightweight, so let's not rewrite this in Rust or React. It's meant to be a straightforward, no-frills webmap for Owntracks users that should be able to run anywhere with minimal setup.

## Future Plans

- [ ] Add support for switching map styles
- [ ] Add support for showing Meshtastic devices/trackers on the map
