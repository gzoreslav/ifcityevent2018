import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Button} from 'react-bootstrap';


class TermsPage extends Component {
    render() {
        return (
            <div className="content-wrapper">
                <div className="event-overlap">
                    <Row className="event-header">
                        <Col className="col" md={8}>
                            <img src="/public/images/category-art.jpg"/>
                        </Col>
                        <Col md={4}>
                            <h1>Ван Гог</h1>
                        </Col>
                    </Row>
                    <Row className="event-tools">
                        <Col md={8}>
                            Поділитись у ФБ
                        </Col>
                        <Col md={4}>
                            <Button>Купити квиток</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <p>Шерлок Гномс
                                Рік: 2018
                                Країна: США, Великобританія
                                Режисер: Джон Стівенсон
                                Жанр: анімація, комедія, сімейний, фентезі
                                Прем’єра (в Україні): 2018-03-15
                                Прем’єра (у світі): 2018-03-15
                                Вікові обмеження (років): 6
                                В ролях:
                                Джонні Депп, Емілі Блант, Джеймс МакЕвой
                                Сюжет
                                Гномео та Джульєтта переїжджають до Лондона. Ох, скільки всього нового їх чекає,
                                скільки пригод і відкриттів. Весна вже зовсім близько, тому всі садові гноми готуються
                                до неї як можуть. Але по величезному мегаполісі проходить серія викрадень їхніх побратимів.
                                Тепер кожен садовий гном боїться за свою цілісність, адже забрати можуть і його. І сталося найстрашніше –
                                викрали всіх друзів Гномео і Джульєтти, тільки цю любовну парочку пронесло. Шукати зниклих
                                гномів готовий найкращий сищик на Землі – Шерлок Гномс. Він разом зі своїм постійним
                                супутником Ватсоном зробить усе можливе, щоб урятувати існування садових гномів.</p>
                        </Col>
                        <Col md={4}>
                            Дата і час
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default TermsPage;