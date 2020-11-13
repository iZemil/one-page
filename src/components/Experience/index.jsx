import React, { useState } from 'react';
import Slider from 'react-slick';
import Modal from 'react-modal';
import { Scrollbars } from 'react-custom-scrollbars';

import mightyMachines from './images/mighty_machines.png';
import romad from './images/romad.png';
import onovo from './images/onovo.png';
import moximo from './images/moximo.jpg';
import wine from './images/wine.jpg';
import './styles.styl';

export const SliderArrow = ({ onClick, type }) => (
    <button type="button" className={`experience__slider-arrow experience__slider-arrow_${type}`} onClick={onClick}>
        <svg
            id="Layer_1"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 150 118"
            xmlSpace="preserve"
        >
            <g transform="translate(0.000000,118.000000) scale(0.100000,-0.100000)">
                <path d="M870,1167c-34-17-55-57-46-90c3-15,81-100,194-211l187-185l-565-1c-431,0-571-3-590-13c-55-28-64-94-18-137c21-20,33-20,597-20h575l-192-193C800,103,794,94,849,39c20-20,39-29,61-29c28,0,63,30,298,262c147,144,272,271,279,282c30,51,23,60-219,304C947,1180,926,1196,870,1167z" />
            </g>
        </svg>
    </button>
);

const settings = {
    className: 'experience__slider',
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SliderArrow type="next" />,
    prevArrow: <SliderArrow type="prev" />,
};

const PORTFOLIO_LIST = [
    {
        title: 'Onovo',
        description: 'Dendra hotel with urban dynamics are combined with the tranquility of nature. Booking app',
        image: onovo,
    },
    {
        title: 'Romad',
        description: 'Ico website. Attracting potential investors and partners for the development of the project',
        image: romad,
    },
    // {
    //     title: 'WW',
    //     description: 'Wine catalog web application',
    //     image: wine,
    // },
    {
        title: 'The Mighty Machines',
        description: 'Online store for the sale of electric motorcycles',
        image: mightyMachines,
    },
    {
        title: 'Moximo',
        description: 'Recruiting agency app',
        image: moximo,
    },
];

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        padding: 0,
        transform: 'translate(-50%, -50%)',
        minWidth: 320,
        maxWidth: 800,
        color: '#000',
    },
};
Modal.setAppElement('#app');

export default function Experience() {
    const [openedModal, setModal] = useState(null);
    const openModal = (title) => {
        document.querySelector('.outer-nav').classList.add('is-vis');
        setModal(title);
    };
    const closeModal = () => {
        document.querySelector('.outer-nav').classList.remove('is-vis');
        setModal(null);
    };

    const thumb = ({ style, ...props }) => {
        const thumbStyle = {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxShadow: '0 0 0px 1px rgba(255, 255, 255, 0.8)',
            right: 2,
        };
        return <div style={{ ...style, ...thumbStyle }} {...props} />;
    };

    return (
        <div className="experience">
            <div className="experience__content">
                <Slider {...settings}>
                    {PORTFOLIO_LIST.map(({ title, description }) => (
                        <div className="experience__slider-item" key={title}>
                            <div className="experience__slider-item-wrapper">
                                <h3>{title}</h3>
                                <p>{description}</p>

                                <button type="button" className="experience__button" onClick={() => openModal(title)}>
                                    See result
                                </button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* https://www.npmjs.com/package/react-modal */}
            <Modal
                isOpen={Boolean(openedModal)}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                className="dialog"
                overlayClassName="dialog__overlay"
            >
                <Scrollbars
                    style={{ height: '98vh', width: 600 }}
                    renderThumbHorizontal={thumb}
                    renderThumbVertical={thumb}
                >
                    <div className="portfolio__wrapper">
                        <img
                            alt="sample"
                            src={openedModal ? PORTFOLIO_LIST.find((it) => it.title === openedModal).image : ''}
                        />
                    </div>
                </Scrollbars>
            </Modal>
        </div>
    );
}
