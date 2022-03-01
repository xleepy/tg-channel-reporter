### Telegram channel reporter

create .env file and add
TDLIB_COMMAND="./tdlib/lib/libtdjson"

Get API_ID and API_HASH from https://core.telegram.org/api/obtaining_api_id

add as key=value format to .env

API_ID= -- your id --

API_HASH= -- your hash --

Script will ask phone number, code and additionally password if you haven't got password just enter empty string
All password and user data stored only locally on in folder in `db` folder.

### To run from folder:
- npm install
- npm run start
- follow cli
- additionally you can provide path to file by running command `npm run start /path/to/file`
- file path or channels not provided, script will ask you to provide channels manually in format
firstlink, secondLink, etc...
### To run this from everywhere run:
- npm install
- npm run build
- npm install -g

### TDlib
You need to build tdlib manually

Instructions for tdlib build
https://tdlib.github.io/td/build.html?language=JavaScript

Then replace current folder

Tested on macOS node 16.13.2

### Additional notes:
Default filename is `channels.txt`

I'll try to find a way how to create executable with all dependencies already bundled together so i hope in future everyone who wants to use that script can skip library compilation step.

