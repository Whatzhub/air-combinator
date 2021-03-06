### AIR COMBINATOR v1.0.0 ###

### Supported OTAs List ###

* https://www.via.id/ - done
* https://www.fly365.com - done
* https://www.helloworld.com.au - done
* https://www.expedia.com.sg - pending (require an extra step to manually get the 'c' key value)

### App Stack ###

1. Node.js + Express.js as local backend + server
2. Vue.js as frontend view
3. A scraping engine `scraper.js` that can be extended to include other OTAs

### How do I get set up? ###

1. Install Node.js (https://nodejs.org/en/)
2. Run `npm install` on app root path
3. Run `npm start` and happy developing!

* To Build
Run `webpack -p`
Note: The p flag is “production” mode and uglifies/minifies output. Also required when new folder/files added.

* To continuously-build while in dev mode
Run `webpack --watch`
Note: Run this together with `npm start` for rapid development

* To display error log details in dev mode
Run `webpack --display-error-details`

### License

The MIT License (MIT)

Copyright (c) 2017 Daniel Chan danielchan.yes@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
