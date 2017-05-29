### AIR COMBINATOR v1.0.0 ###

### OTA LISTs ###

* https://www.via.id/ - done
* https://www.fly365.com - done
* https://www.expedia.com.sg - done (require an extra step to manually get the 'c' key value)
* https://www.helloworld.com.au


### TODOS ###

1. Client-side Validation
    - disallow if departure day is today
2. Add further OTAs

### How do I get set up? ###

webpack -p
Note: The p flag is “production” mode and uglifies/minifies output.

webpack --watch

webpack --display-error-details

sass --watch index.scss:index.css init.scss:init.css --style compressed

uglifyjs ./dist/index.js \
         -o ./dist/index.min.js \
         -p 5 -c -m

### Who do I talk to? ###

* Daniel Chan, Technical Optimization Team @TVPT HK