(function () {
    'use strict';

    angular
        .module('serviceWindow')
        .factory('responseService', responseService);

    responseService.$inject = ['locationService'];

    function responseService(locationService) {

        var api = {};

        // decodeResponse()
        // Decodes the passed in XML string that has been received in the Web Socket response.
        // Parameters:
        //	xmlString:	The XML string to decode.
        // Returns:
        //	An object containing the extract XML details or NULL if we could not decode the XML.
        api.decode = function(xmlString) {

            var returnObject = {
                type: "",
                funct: "",
                typeAttributes: [],
                attributes: [],
                children: {}
            };

            // Convert the XML string into a document so we can use XPath to navigate it.
            var doc = new DOMParser().parseFromString(xmlString, 'text/xml');

            // Create the start path.
            var path = "/gam:Gamora";

            // Get the Message Type.
            var nodes = doc.evaluate(path, doc, nsResolver, XPathResult.ANY_TYPE, null);
            var currentNode = nodes.iterateNext();

            if (!currentNode) {
                // If in debug mode, log the message to the console.
                if (locationService.getFromURL("debug")) {
                    console.log("[Reosponse Service : decoding] - Message Type not found." );
                }
                return null;
            }

            // Got the Message Type. Set currentNode to point to the Message Type.
            currentNode = currentNode.childNodes[0];
            returnObject.type = currentNode.nodeName.replace('gam:', '')

            // Get any attributes for the Type.
            returnObject.typeAttributes = getAttributes(currentNode);

            // Check we have a Message Function.
            if (currentNode.childNodes.length == 0) {
                // If in debug mode, log the message to the console.
                if (locationService.getFromURL("debug")) {
                    console.log("[Reosponse Service : decoding] - Message function not found.");
                }
                return null;
            }

            // Got the Message function. Set currentNode to point to the Message Function.
            currentNode = currentNode.childNodes[0];
            returnObject.funct = currentNode.nodeName.replace('gam:', '');

            // If in debug mode, log the message to the console.
            if (locationService.getFromURL("debug")) {
                console.log("[Reosponse Service : decoding] - Message Type: ", returnObject.type);
                console.log("[Reosponse Service : decoding] - Message Function: ", returnObject.funct);
            }

            // Get any attributes for the Message Function.
            returnObject.attributes = getAttributes(currentNode);

            // Now extract any child object details.
            if (currentNode.childNodes != null) {

                // Loop through each childNode and extract the attributes into the returnObject.children array.
                for (var index = 0; index < currentNode.childNodes.length; index++) {

                    // Get the local name.
                    var localName = currentNode.childNodes[index].localName;

                    // If localName is not empty, add the attributes to the children object.
                    if (localName != null && localName != "") {
                        returnObject.children[localName] = getAttributes(currentNode.childNodes[index])
                    }
                }
            }

            return returnObject;

            // getAttributes()
            // Extracts the attributes and values for the passed node and returns them as an object.
            // Parameters:
            //	node:	The node to extract the attributes from.
            // Returns:
            //  An object containing the extracted attributes.
            function getAttributes(node) {

                var attributes = {};

                for (var index = 0; index < node.attributes.length; index++) {
                    // Extract the attribute name - checking for clashes with javaScript names.
                    // Note that we also remove lara: which is used for the Customer attributes.
                    var attributeName = checkForPropertyClash(node.attributes[index].nodeName.replace('gam:', '').replace('lara:', ''));

                    // Store the attribute name and value in the attributes object.
                    attributes[attributeName] = node.attributes[index].nodeValue;
                }

                return attributes;
            }

            // checkForPropertyClash()
            // Because we are dynamically adding property names, we need to ensure that the name does not clash
            // with any existing javaScript property names.
            // Check the passed in property name. If it matches a javaScript property, return an amended property name.
            function checkForPropertyClash(property) {

                if (property === 'length') { return 'len'; }

                return property;
            }

            // nsResolver()
            // Used to resolve the names space prefix passed in from the XML string.
            // Parameters:
            //  prefix:		The XML Prefix to resolve.
            // Returns:
            //  The resolved URL or null.
            function nsResolver(prefix) {

                if (prefix === 'gam') {
                    return 'http://IntelligentGaming/Gamora/v1.0';
                } else {
                    return null;
                }
            }
        }

        return api;
    }
})();