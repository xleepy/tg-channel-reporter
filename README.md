### Telegram channel reporter

create .env file and add
TDLIB_COMMAND="./tdlib/lib/libtdjson"

Get API_ID and API_HASH from https://core.telegram.org/api/obtaining_api_id

add as key=value format to .env
API_ID=<your id>
API_HASH=<your hash>

### To run from folder:
- npm run start
- follow cli
### To run this from everywhere run:
- npm run build
- npm install -g

Acceptable format
url => firstlink, secondLink, etc...


TDlib already included you don't need to compile it i think

### Additional notes:
Default filename is `channels.txt`
If file doesn't exists then script will ask you to provide urls through CLI
