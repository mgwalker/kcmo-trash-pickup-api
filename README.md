# KCMO Trash Pickup Day API

[![CircleCI](https://img.shields.io/circleci/project/github/mgwalker/kcmo-trash-pickup-api.svg)](https://circleci.com/gh/mgwalker/kcmo-trash-pickup-api/tree/master)

Hosted on AWS at [https://apis.darkcooger.net/kcmo-trashday](https://apis.darkcooger.net/kcmo-trashday).  Accepts HTTP `GET` requests with a single query string parameter `address`, the address to look for.  Returns a JSON object with a single property `trashDah`, that is the day of the week that trash is picked up at the requested address.

### Quick example

If you call `https://apis.darkcooger.net/kcmo-trashday?address=414 E 12th St` (City Hall!), you'll get a response of:

```json
{
  "trashDay": "Monday"
}
```
