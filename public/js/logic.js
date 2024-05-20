function updateCountdown() {
    const now = new Date();
    const diff = revealDate - now;

    // Stop the timer if the date is in the past and send call to API
    if (diff <= 1000) {
        clearInterval(timer);
        setTimeout(fetchGenderUponReveal, (diff > 0) ? diff : 0);
        return;
    }

    const timeUnits = getTimeUnits(diff);
    document.getElementById('countdown-timer').innerHTML = `${timeUnits.days} days, ${timeUnits.hours} hours, ${timeUnits.minutes} minutes, ${timeUnits.seconds} seconds`;
}

function getTimeUnits(ms) {
    const seconds = Math.floor(ms / 1000 % 60);
    const minutes = Math.floor(ms / 1000 / 60 % 60);
    const hours = Math.floor(ms / 1000 / 60 / 60 % 24);
    const days = Math.floor(ms / 1000 / 60 / 60 / 24);
    return { days, hours, minutes, seconds };
}

function fetchGenderUponReveal() {
    fetch(`/api/genderReveal`).then(res => res.json()).then((data) => {
        console.log(JSON.stringify(data));
        document.getElementById('countdown-timer').innerHTML = formatGenderRevealString(data.children);
        document.getElementById('body').style.backgroundColor = data.backgroundColor;
        document.getElementById('body').style.fontSize = '50px';
    }).catch(err => console.log(err));
}

/**
 * @typedef {Object} Child
 * @property {string} gender - The gender of the child. (ex. M, F, etc)
 * @property {number} genderName - The common noun used to refer to the child (ex. boy, girl, etc.)
 * @property {string} childName - The optional name of the child to provide in the interface.
 */

/**
 * Formats the output string to the web interface for.
 *
 * @param {Child[]} childrenNode - The JSON node that represents the children array
 *
 * @returns {string} - The formatted string to present to the UI
 *
 * @author Bradley Hooten <hello@bradleyh.me>
 * @since 1.1
 */
function formatGenderRevealString(childrenNode)
{
    var finalString = "It's a ";

    switch(childrenNode.length)
    {
        case 0:
            return "An error has occurred. Please refresh the page to confirm.";
        case 1:
            // Add the one child to the string and then return it
            finalString = finalString + childrenNode[0].genderName +
                (childrenNode[0].childName ? " named " + childrenNode[0].childName : '') + "!";

            return finalString;
        case 2:
            // Add the first child to the string
            finalString = finalString + childrenNode[0].genderName +
                (childrenNode[0].childName ? " named " + childrenNode[0].childName : '');

            // Add the second child to the string
            finalString = finalString + " and a " + childrenNode[1].genderName +
                (childrenNode[1].childName ? " named " + childrenNode[1].childName : '') + "!";

            return finalString;
        default:
            for(i = 0; i < childrenNode.length; i++)
            {
                // Check to see if this is the last element
                if(i === childrenNode.length - 1)
                {
                    finalString = finalString + ", and a "
                }
                else if(i !== 0)
                {
                    finalString = finalString + ", a ";
                }

                finalString = finalString + childrenNode[i].genderName + (childrenNode[i].childName ? " named " + childrenNode[i].childName : '');
            }

            return finalString + "!";
    }
}

// Update the countdown every 1 second (1000 milliseconds)
const timer = setInterval(updateCountdown, 1000);

// Initialize the countdown
updateCountdown();