(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .decorator('$window', windowDecorator);

    // exceptionHandler Decorator
    windowDecorator.$inject = ['$delegate'];
    function windowDecorator($delegate) {
        // Define our custom error handler that will pipe errors into the core
        // $exceptionHandler service (where they may be further processed).
        // --
        // NOTE: Only message, fileName, and lineNumber are standardized.
        // columnNumber and error are not standardized values and will not be
        // present in all browsers. That said, they appear to work in all of the
        // browsers that "matter".
        $delegate.onerror = function (message, fileName, lineNumber, columnNumber, error) {
            // If this browser does not pass-in the original error object, let's
            // create a new error object based on what we know.
            if (!error) {
                error = new Error(message);
            }
            // pipe errors into the core $exceptionHandler service
            console.error('Global Error Handler', {
                fileName: fileName,
                lineNumber: lineNumber,
                columnNumber: (columnNumber || 0),
                message: error.message,
                stack: error.stack
            });
        };
        return $delegate;
    }
})();