// This is needed to allow a deprecated method to be used to prevent errors when querying the mutation add lyric to song. 
const mongoose = require('mongoose');
mongoose.plugin(schema => {
    schema.options.usePushEach = true;
});
require('./song');
require('./lyric');
