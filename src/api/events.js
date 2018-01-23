import fetch from '../services/fetchAdapter';
import appSettings from '../constants/aplication';


export const fetchEvents = (payload) => {
    let config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    if (payload) {
        config.body = {};
        if (payload.category) {
            config.body.categories = [payload.category];
        }
        if (payload.new) {
            config.body.new = payload.new;
        }
        config.body = JSON.stringify(config.body);
    }
    return fetch(`${appSettings.apiURL}/events/search`, config)
        .then(response => {
            return response.json();
        })
        .then(json => {
            return { data: json };
        })
        .catch(ex => (
            {
                metadata: {
                    error: ex
                }
            }
        ));
};

export const fetchEvent = (eventId) => {
    return fetch(`${appSettings.apiURL}/events/${eventId}`)
        .then(response => {
            return response.json();
        })
        .then(json => {
            return { data: json };
        })
        .catch(ex => (
            {
                metadata: {
                    error: ex
                }
            }
        ));
};

export const saveEvents = ({token, events}) => {
    let config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    let promises = [];
    let i, j, chunk = 10;
    for (i = 0, j = events.length; i < j; i += chunk) {
        promises.push(
            fetch(
                `${appSettings.apiURL}/events`,
                {...config, body: JSON.stringify(events.slice(i, i + chunk))}
            )
        );
    }
    return Promise.all(promises)
        .then(() => (
            {
                data: [],
                metadata: {
                    success: true
                }
            }
        ))
        .catch(ex => (
            {
                metadata: {
                    error: ex
                }
            }
        ));
};
