This is the lightweight date picker plugin for MooTools. It should work with all MooTools versions above 1.3. This plugin requires Locale.js and Date.js from MooTools-More. Basic usage:

1. Include the required dependencies: 

    * script src=.... path to mootools-core-x.x.x-full-compat-yc.js
    * script src=.... path to mootools-more/Source/Locale/Locale.js
    * script src=.... path to mootools-more/Source/Types/Date.js

2. (optional) Inlude the default css, or if you dont like it - create one by your own. The default css path is:

* link href="... path to datepicker/assets/datepicker.css" rel="stylesheet" 

3. Create input field with appropriate class (default = "dateinput")

4. Call the plugin, like:

    var dp = new DatePicker($$('.dateinput'), options);


* P.S: There are very few options right now, becuase the plugin is intended only to provide the very basic functionality. Feel free to fit it to your needs.

default options = {
    * pickerClass: 'datepicker', // table class
    * inputClass: 'dateinput',   // input field class for applying the custom css
    * month: 0, // -> if 0 use the current month
    * year: 0   // -> if 0 use the current year
}

