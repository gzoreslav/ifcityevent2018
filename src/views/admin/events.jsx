import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, ControlLabel, Button, Modal} from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { Loading, NoData } from '../../components/tools.jsx';
import {
    getEventsAction,
    removeEventAction,
    updateEventAction,
    addEventAction,
    syncEventAction
} from '../../actions/eventsActions';
import { getCategoriesAction } from '../../actions/categoriesActions';
import {
    EventType,
    EventPlace,
    EventTime,
    EventPrice,
    EventPhone,
    EventSource,
    EventTags
} from '../../components/eventAttributes.jsx';
import EventForm from './form/eventForm.jsx';
import moment from "moment";
import {eventTimeObj, placeObj, priceObj} from '../../services/logicHelper';


class Event extends Component {
    constructor(props) {
        super(props);
        this.removeEvent = this.removeEvent.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.syncEvent = this.syncEvent.bind(this);
        this.shareEvent = this.shareEvent.bind(this);
    }

    removeEvent() {
        this.props.removeEvent(this.props.event);
    }

    updateEvent() {
        this.props.updateEvent(this.props.event);
    }

    syncEvent() {
        this.props.syncEvent(this.props.event);
    }

    shareEvent() {
        this.props.shareEvent(this.props.event);
    }

    render() {
        const {event, categories} = this.props;
        const detailedLink = `/event/${event._id}`;
        return (
            <tr
                key={event._id}
                className={event.invalid ? 'invalid' : ''}
            >
                <td>
                    <Link to={detailedLink}>
                        <h4>{event.name}</h4>
                    </Link>
                    <EventType category={event.category} categories={categories}/>
                    <EventPlace place={event.place}/>
                    <EventTime event={event}/>
                    <EventPrice event={event}/>
                    <EventPhone phone={event.phone}/>
                    <EventSource event={event}/>
                    <EventTags tags={event.tags}/>
                    {event.isSync || event.syncId ?
                        <span>
                            <span className="label label-success">
                                {event.isSync ?
                                    `Синхронізовано з IFCity (${event.syncId})`
                                    : `Змінено, не відповідає IFCity (${event.syncId})`
                                }
                            </span>
                            {' '}
                        </span> : null}
                    {event.editorChoice ? <span className="label label-info">вибір редакції</span> : null}
                    {event.hidden ? <span><span className="label label-warning">прихована</span>{' '}</span> : null}
                    {event.invalid ? <span className="label label-danger">невалідна</span> : null}
                </td>
                <td>
                    <img style={{maxWidth: '100%'}} src={_.get(event, 'cover.source', '')}/>
                </td>
                <td>
                    {event.description}
                </td>
                <td>
                    <Button bsStyle="success" bsSize="small" onClick={this.updateEvent}>Редагувати</Button>
                    <br/>
                    <br/>
                    <Button bsStyle="danger" bsSize="small" onClick={this.removeEvent}>Видалити</Button>
                    <br/>
                    <br/>
                    {!event.invalid ?
                        <Button bsStyle="warning" bsSize="small" onClick={this.syncEvent} disabled={event.isSync}>
                            Синхронізувати з IFCity
                        </Button>
                        : null
                    }
                    <br/>
                    <br/>
                    <Button bsStyle="info" bsSize="small" onClick={this.shareEvent}>Поширити у ФБ</Button>
                </td>
            </tr>
        );
    }
}

class EventsList extends Component {
    render() {
        const { events } = this.props;
        const noData =
            <tr>
                <td>
                    <NoData>
                        <h1>Немає подій</h1>
                    </NoData>
                </td>
            </tr>;
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Подія
                        </th>
                        <th style={{width: '20%'}}>
                            Зображення
                        </th>
                        <th style={{width: '50%'}}>
                            Опис
                        </th>
                        <th>
                            Редагування / Синхронізація
                        </th>
                    </tr>
                </thead>
                <tbody>
                {events.length ?
                    events.map(event => (
                        <Event
                            {...this.props}
                            event={event}
                        />
                    ))
                    : noData}
                </tbody>
            </table>
        );
    }
}

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = props.filter;
        this.toggleValid = this.toggleValid.bind(this);
        this.toggleNew = this.toggleNew.bind(this);
        this.toggleHidden = this.toggleHidden.bind(this);
        this.toggleSync = this.toggleSync.bind(this);
        this.toggleAll = this.toggleAll.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.filter);
    }

    toggleValid() {
        this.setState({
            invalid: !this.state.invalid
        }, () => {
            this.props.onFilter(this.state)
        })
    }

    toggleNew() {
        this.setState({
            new: !this.state.new
        }, () => {
            this.props.onFilter(this.state)
        })
    }

    toggleHidden() {
        this.setState({
            hidden: !this.state.hidden
        }, () => {
            this.props.onFilter(this.state)
        })
    }

    toggleSync() {
        this.setState({
            showNotSync: !this.state.showNotSync
        }, () => {
            this.props.onFilter(this.state)
        })
    }

    toggleAll() {
        this.setState({
            all: !this.state.all
        }, () => {
            this.props.onFilter(this.state)
        })
    }

    render() {
        return (
            <div>
                <input
                    name="isNew"
                    type="checkbox"
                    checked={this.state.new}
                    onChange={this.toggleNew}/>
                {' '}
                <ControlLabel>додані/змінені сьогодні</ControlLabel>
                <br/>
                <input
                    name="isValid"
                    type="checkbox"
                    checked={!this.state.invalid}
                    onChange={this.toggleValid}/>
                {' '}
                <ControlLabel>показувати тільки валідні</ControlLabel>
                <br/>
                <input
                    name="isHidden"
                    type="checkbox"
                    checked={this.state.hidden}
                    onChange={this.toggleHidden}/>
                {' '}
                <ControlLabel>показати також приховані</ControlLabel>
                <br/>
                <input
                    name="isFeature"
                    type="checkbox"
                    checked={this.state.showNotSync}
                    onChange={this.toggleSync}/>
                {' '}
                <ControlLabel>несинхронізовані з IFCity</ControlLabel>
                <br/>
                <input
                    name="isFeature"
                    type="checkbox"
                    checked={this.state.all}
                    onChange={this.toggleAll}/>
                {' '}
                <ControlLabel>показати також минулі</ControlLabel>
            </div>
        )
    }
}

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all: false,
            invalid: false,
            isSync: true,
            hidden: false,
            new: true,
            showModal: false,
            showRemoveModal: false,
            showShareModal: false,
            event: {},
            modalTitle: 'Нова подія'
        };
        this.search = this.search.bind(this);
        this.fetchCategories = this.fetchCategories.bind(this);
        this.onFilter = this.onFilter.bind(this);

        this.newEvent = this.newEvent.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.saveModal = this.saveModal.bind(this);
        this.updateEvent = this.updateEvent.bind(this);

        this.closeRemoveModal = this.closeRemoveModal.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.applyRemove = this.applyRemove.bind(this);

        this.applySync = this.applySync.bind(this);

        this.shareEvent = this.shareEvent.bind(this);
        this.closeShareModal = this.closeShareModal.bind(this);
    }

    componentDidMount() {
        this.search();
        this.fetchCategories();
    }

    search() {
        this.props.dispatch(getEventsAction(this.state));
    }

    fetchCategories() {
        this.props.dispatch(getCategoriesAction());
    }

    onFilter(newFilter) {
        this.setState(
            newFilter,
            () => {
                this.search();
            }
        );
    }

    closeModal() {
        this.setState({ showModal: false });
    }

    removeEvent(event) {
        this.setState({
            showRemoveModal: true,
            event
        });
    }

    closeRemoveModal() {
        this.setState({ showRemoveModal: false });
    }

    closeShareModal() {
        this.setState({ showShareModal: false });
    }

    applyRemove(event) {
        this.closeRemoveModal();
        this.props.dispatch(removeEventAction(event._id));
    }

    applySync(event) {
        this.props.dispatch(syncEventAction({event, categories: this.props.categories.data}));
    }

    newEvent() {
        this.setState({
            showModal: true,
            event: {
                name: '',
                category: 'not_set',
                start_time: moment().format('YYYY-MM-DDT10:00:00ZZ'),
                end_time: '',
                tags: '',
                isSync: false,
                isForChildren: false
            },
            modalTitle: 'Нова подія',
            editType: 'new'
        });
    }

    shareEvent(event) {
        this.setState({
            showShareModal: true,
            event: event,
            modalTitle: `Поширити "${event.name}"`
        });
    }

    updateEvent(event) {
        let evt = _.cloneDeep(event);
        evt.isSync = false;
        this.setState({
            showModal: true,
            event: evt,
            modalTitle: `Редагувати "${event.name}"`,
            editType: 'update'
        });
    }

    saveModal(event) {
        this.closeModal();
        if (!event.end_time) {
            event.end_time = '';
        }
        if (this.state.editType === 'update') {
            this.props.dispatch(updateEventAction(event));
        } else {
            this.props.dispatch(addEventAction(event));
        }
    }

    render() {
        const {data, metadata} = this.props.events;
        return [
            <Row>
                <Col md={4}>
                    <h4>Події</h4>
                </Col>
                <Col md={4}>
                    <Toolbar filter={this.state} onFilter={this.onFilter}/>
                </Col>
                <Col md={4}>
                    <Button bsStyle="success" onClick={this.newEvent}>Додати подію</Button>
                </Col>
            </Row>,
            <Row>
                <Col md={12}>
                    <Loading {...metadata} mask={true}>
                        <EventsList
                            {...this.props}
                            events={data}
                            categories={this.props.categories.data}
                            updateEvent={this.updateEvent}
                            removeEvent={this.removeEvent}
                            syncEvent={this.applySync}
                            shareEvent={this.shareEvent}
                        />
                    </Loading>
                </Col>
            </Row>,
            <EventForm
                title={this.state.modalTitle}
                show={this.state.showModal}
                onHide={this.closeModal}
                onSave={this.saveModal}
                event={this.state.event}
                categories={this.props.categories.data}
            />,
            <Dialog
                event={this.state.event}
                show={this.state.showRemoveModal}
                onHide={this.closeRemoveModal}
                onRemove={this.applyRemove}
            />,
            <ShareDialog
                event={this.state.event}
                show={this.state.showShareModal}
                onHide={this.closeShareModal}
            />
        ];
    }
}

class Dialog extends Component {
    render() {
        const {onHide, show, event, onRemove} = this.props;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Видалити <strong>{event.name}</strong>?
                </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="success" onClick={() => onRemove(event)}>Видалити</Button>
                <Button onClick={onHide}>Закрити</Button>
            </Modal.Footer>
        </Modal>
        );
    }
}

class ShareDialog extends Component {
    render() {
        const {onHide, show, event} = this.props;
        let text = `\<відредагувати опис нижче, затегати місце проведення, видалити посилання на сайт після рендерингу у ФБ\>\n\n${event.description}` +
            `\n\n${event.name}` +
            `\n\nВАРТІСТЬ: ${priceObj(event.price).str}` +
            `\n\nДАТА І ЧАС\n${eventTimeObj(event).fullTime}` +
            `\n\nЛОКАЦІЯ\n` +
            `${event.place && event.place.name ? event.place.name + '\n' : ''}` +
            `${event.place && event.place.location && event.place.location.street ? event.place.location.street : ''}` +
            `\n\nhttp:\/\/ifcityevent.com\/event\/${event._id}` +
            `\n\nЯкщо Ви хочете завжди бути в курсі подій у Івано-Франківську - встановлюйте на свій смартфон додаток ` +
            `IFCITY або долучайся до телеграм каналу https:\/\/t.me\/ifcity1`;
        return (
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Поширити {event.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea style={{width: '100%', height: '300px'}}>
                        {text}
                    </textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide}>Закрити</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}


Events.propTypes = {
    events: PropTypes.object,
    categories: PropTypes.object,
    dispatch: PropTypes.func.isRequired
};
const mapStateToProps = (state) => {
    return {
        events: state.events,
        categories: state.categories
    };
};

export default connect(mapStateToProps)(Events);