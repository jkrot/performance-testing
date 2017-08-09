# That Conference August 6-8 2018
https://github.com/ThatConference/that-branding/blob/master/SpeakerDeckTemplates/BackgroundsThat-Conference-2018.png


# Performance Testing

Javascript performance testing has been a major issue due to a lack of features.  Chrome has made this much more useful but lets see what you can do in any browser before diving into chrome specifically.

Main issues of performance have been

1.  Jumpy or slow animations
2.  Memory leaks so applications get slower over time
3.  Poor API performance

## Timing Testing
Performance.now()  is a candiate for standarization.  A nice article about it can be found at https://www.sitepoint.com/measuring-javascript-functions-performance/

## Dev Tools
Great overview of chrome dev tools if you want to look into it more.
https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool

Another review of chrome dev tools
http://www.dwmkerr.com/fixing-memory-leaks-in-angularjs-applications/

Microsoft Edge dev tools have been progressing nicely and they have a few good partners and tools as well.
https://developer.microsoft.com/en-us/microsoft-edge/tools/

### Jumpy Animations

Source code for this example was from code labs found at 
https://codelabs.developers.google.com/codelabs/web-perf/index.html

New Chrome Dev tools helps troubleshoot scrolling issues
https://developers.google.com/web/updates/2017/07/devtools-release-notes

### Long Term Memory Analysis

Windows Only
https://developers.google.com/web/tools/chrome-devtools/memory-problems/

Node Only
https://github.com/lloyd/node-memwatch
https://github.com/bnoordhuis/node-heapdump

### Angular Specific Issues

To many watchers or overuse of ng-show/ng-hide

https://www.airpair.com/angularjs/posts/angularjs-performance-large-applications

Angular Specific Tools

https://www.vividcortex.com/blog/common-ui-performance-problems-in-angular-apps

<<<<<<< HEAD
=======
Performance Tooling in AngularJS
$compileProvider.debugInfoEnabled(false);  Is the biggest consideration 

Performance Tooling in Angular2/4

https://angular.io/guide/aot-compiler

>>>>>>> 55b0ec0bf81de6affbda7caa6595e2131d8ec7f7
#  That Conference Sponsors 
https://github.com/ThatConference/that-branding/blob/master/SpeakerDeckTemplates/BackgroundsThat-Conference-Sponsors-Slide.png
