## this is a mono-repo project


## MIGRATION FLOW WILL HAPPEN IN INCREMEMTAL UPGRADE

## HAVE A LOOK ON LERNA MONO REPO SYSTEM

## STEPS TO CONSIDER

`Lerna is most useful in segregating your app into modules/packages`

`Follow Allergies module as a sample for reference and create your own modules packages`

`Create artifacts by running the specific package build`

`Update your dependencies in your main app with the version deployed artifact`

`Update the Readme.md and changelog.md on each commit about version history of the packaging.`

`Maintain good documentation about the avaialble components and services in your packaged module`

`By approaching this mono repo system you will end up with component driven approach of angular only`

`Your main application will contains the code related to integration of your packaged components usage only, this way you will reduce the deploying whole application at a time and you can track your changes of package.`

`Use the packaged componets only in your main application, in this way your main app will have less code.`

`use oc.lazyload on module/packaging basis i.e if you need a component from a particular package then load whole packge minified code. By this you can reduce the number of hits on your server and you'll have less maintainance activity.`