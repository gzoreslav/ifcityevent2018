import moment from 'moment';


moment.locale('uk');

export const eventOneTimeStr = (eventTime) => {
    return moment(eventTime).format('LL о LT');
};

export const eventSameDateStr = ({start_time, end_time}) => {
    return `${moment(start_time).format('LL з LT')} по ${moment(end_time).format('LT')}`;
};

export const eventDefaultRangeStr = ({start_time, end_time}) => {
    return `з ${moment(start_time).format('LL, LT')} по ${moment(end_time).format('LL, LT')}`;
};

export const eventTimeStr = ({start_time, end_time}) => {
    if (!start_time) {
        return 'Дата події не вказана';
    }
    if (!end_time) {
        return eventOneTimeStr(start_time);
    }
    if (moment(start_time).format('LL') === moment(end_time).format('LL')) {
        return eventSameDateStr({start_time, end_time});
    }
    return eventDefaultRangeStr({start_time, end_time});
};


const noPlace = 'Локація не вказана';
const noPrice = 'Ціна не вказана';
const freePrice = 'Безкоштовно';

export const placeLocation = (location) => {
    if (!location) {
        return '';
    }
    return location.street;
};

export const placeObj = (place) => {
    let result = {
        name: '',
        location: ''
    };

    if (!place) {
        result.name = noPlace;
        return result;
    }

    if (!place.name) {
        if (!place.location) {
            result.name = noPlace;
            return result;
        }
        result.name = placeLocation(place.location);
        return result;
    }

    result.name = place.name;
    result.location = placeLocation(place.location);
    return result;
};

export const priceObj = (price) => {
    let result = {
        str: '',
        mayBuy: false,
        isFree: false
    };

    if (!price || (!price.from && !price.to)) {
        result.str = noPrice;
        return result;
    }

    if (price.from) {
        if (!price.to) {
            result.isFree = parseInt(price.from, 10) === 0;
            result.str = result.isFree ? freePrice : `${price.from} грн.`;
            result.mayBuy = true;
            return result;
        }
        result.str = `${price.from} - ${price.to} грн.`;
        result.mayBuy = true;
        return result;
    }

    result.str = `до ${price.to}`;
    result.mayBuy = true;
    return result;
};