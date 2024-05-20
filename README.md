# GenderReveal-Web

Welcome to GenderReveal-Web, a lightweight Gender Reveal web app written in Express.

## Installation

To run the GenderReveal-Web app locally, follow these steps:

1. Clone the repository: `git clone https://github.com/bhooten/genderreveal-express.git`
2. Install the dependencies: `npm install`
3. Start the server: `npm start`
4. Configure the configuration file: `./config.json` (the file is generated on first launch)

## Usage

Once the server is running, you can access the application by opening `http://localhost:3000` in your web browser.

## Configuration

On the first launch of the application using `npm start`, a default configuration file will be initialized in the base
directory of the application.

Starting with version `1.1`, multiple children are supported. The `children` configuration node is a JSON array which 
takes a variable number of children with the following configuration keys:
- `children.gender` - The single-character gender code. Examples include `F`, `M`, `X`, etc.
- `children.genderName` - The proper noun used to refer to the child instance. Examples include `girl`, `boy`, etc.
- `children.childName` - **OPTIONAL** - The name of the child. If none is supplied, the language to specify the name will be automatically omitted.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit
a pull request.

## License

This project is licensed under the [GNU General Public License](LICENSE.md).
