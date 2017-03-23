## Installation

Heroku:
heroku create render-language --buildpack https://codon-buildpacks.s3.amazonaws.com/buildpacks/heroku/emberjs.tgz
heroku config:set GOOGLE_TRANSLATE_API_KEY=XXXXXX

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `GOOGLE_TRANSLATE_API_KEY=XXXXXX ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).
