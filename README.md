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

### Who do I talk to? ###

`Daniel Chan, daniel.chan@travelport.com, Technology Optimization Team @APAC`