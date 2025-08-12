import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';


class Booking {
    constructor(element) {
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
    }

    render(element) {
        const thisBooking = this;

        const generatedHTML = templates.bookingWidget();
        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;
        thisBooking.dom.wrapper.innerHTML = generatedHTML;


        thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    }


    initWidgets() {
        const thisBooking = this;

        thisBooking.peopleAmountWidget = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.hoursAmountWidget = new AmountWidget(thisBooking.dom.hoursAmount);

        
        thisBooking.dom.peopleAmount.addEventListener('updated', function () {
            const people = thisBooking.peopleAmountWidget.value;
            console.log('Zmieniono liczbę osób:', people);
        
        });

        thisBooking.dom.hoursAmount.addEventListener('updated', function () {
            const hours = thisBooking.hoursAmountWidget.value;
            console.log('Zmieniono liczbę godzin:', hours);
            
        });

    }

}
export default Booking;
