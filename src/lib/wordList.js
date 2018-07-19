const fs = require('fs');

var WordList = function() {
    const regex = new RegExp(/[\p{L}'\w<:]+/gm);
    var self = this;

    /**
     * Clears the wordlist
     */
    this.clear = function() {
        fs.writeFile('./words.json', JSON.stringify([]), (err) => {
            if (err) {
                console.log(err);
                return;
            }

            console.log('! wordlist cleared');
        });
    };

    /**
     * Write something to wordlist
     * @param string
     */
    this.write = function(string) {
        let words = require('./../words.json');

        let matches = string.match(regex);
        for (let match in matches) {
            // If word exists in the json file, update count
            let wordIndex = words.findIndex((elem) => {return elem.word === matches[match];});
            if (wordIndex !== -1) {
                //console.log('~ Word count increased for "' + matches[match] + '"');
                words[wordIndex].count++;
            }
            // Else, add a new word to the list
            else{
                //console.log('+ New word "' + matches[match] + '" detected!');
                words.push({word: matches[match], count: 1});
            }
        }

        // Sort
        words = words.sort(function (a, b) {
            return b.count-a.count;
        });

        // Print what we have
        self.prettyPrint(words);

        fs.writeFile('./words.json', JSON.stringify(words), (err) => {
            if (err) {
                console.log(err);
                return;
            }

            //console.log('- data chunk saved successfully!');
        });
    };

    /**
     * Get amount of words currently in wordlist
     */
    this.getCount = function() {
        console.log(this.get().length);
    };

    /**
     * Print all words and occurrences to terminal
     * @param words
     * @param limit
     */
    this.prettyPrint = function(words, limit) {
        if (words === undefined) {
            words = require('./../words.json');
        }
        if (limit === undefined) {
            limit = words.length;
        }

        for (wordListObj in words) {
            console.log(words[wordListObj].word + ' (' + words[wordListObj].count + ' occurrences)');
            limit--;
            if(limit <= 0) {return;}
        }
    };

    /**
     * Returns the wordlist as javascript object
     */
    this.get = () => {
        return require('./../words.json');
    }

};

module.exports = new WordList();