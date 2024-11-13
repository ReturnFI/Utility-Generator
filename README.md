# Utility Generator Cloudflare Worker

This Cloudflare Worker script provides a web-based utility tool for generating UUIDs, customizable passwords, and QR codes. The tool includes a dark mode option, a responsive layout, and a "click to copy" feature for generated UUIDs and passwords. It uses Bootstrap for styling and includes features like localStorage to save the dark mode preference.

## Features

- **UUID Generation**: Generate a random UUID.
- **Password Generation**: Generate a customizable password with options for character length and types of characters to include.
- **QR Code Generation**: Generate a QR code from user-provided text.
- **Dark Mode**: User-friendly dark mode with persistent storage.
- **Responsive UI**: Centered, mobile-friendly interface with Bootstrap styling.
- **Click to Copy**: One-click copy feature for UUIDs and passwords.

## Getting Started

1. Copy the contents of worker.js to your Worker script.
2. Deploy the Worker.

### Usage

Once deployed, the Worker offers a user-friendly interface for accessing UUIDs, passwords, and QR codes:

1. **UUID Generation**
   - Click "Generate UUID" to create a UUID.
   - Use the "Copy" button to save the result to your clipboard.

2. **Password Generation**
   - Choose a password length (16, 32, 64, 128, 256).
   - Toggle character type options (lowercase, uppercase, numbers, symbols, exclude similar/ambiguous characters).
   - Click "Generate Password" to create a password.
   - Use the "Copy" button to save the result to your clipboard.

3. **QR Code Generation**
   - Enter text into the input field and click "Generate QR Code" to display a QR code for that text.

4. **Dark Mode**
   - Toggle dark mode using the checkbox at the top. Your preference is saved in `localStorage`.

### API Endpoints

The worker script also includes API endpoints that can be called directly:

- **Generate UUID**: `/generate-uuid`
- **Generate Password**: `/generate-password`
  - **Parameters**:
    - `length`: Length of the password (default: 16).
    - `lowercase`: Include lowercase letters (default: true).
    - `uppercase`: Include uppercase letters (default: true).
    - `numbers`: Include numbers (default: true).
    - `symbols`: Include symbols (default: false).
    - `excludeSimilar`: Exclude similar characters (default: false).
    - `excludeAmbiguous`: Exclude ambiguous characters (default: false).
- **Generate QR Code**: `/generate-qrcode`
  - **Parameters**:
    - `text`: Text to encode (default: "Hello, World!").

### Additional Notes

- The QR code uses an external API (`api.qrserver.com`) for generating images. This can be replaced with an alternative API if desired.
- LocalStorage is used to persist dark mode preferences between sessions.
  
### License

This project is open-source and available under the GNU License. See the [LICENSE](LICENSE) file for more information.
