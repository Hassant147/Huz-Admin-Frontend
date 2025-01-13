// formUtils.js

export const resetFormAndTab = () => {
    localStorage.removeItem('activeTab');
    localStorage.removeItem('formData');
    localStorage.removeItem('completedTabs');
    localStorage.removeItem('basicDetails');
    localStorage.removeItem('flightDetails');
    localStorage.removeItem('transportDetails');
    localStorage.removeItem('ziyarahDetails');
    localStorage.removeItem('MakkahHotelDetails');
    localStorage.removeItem('MadinahHotelDetails');
    localStorage.removeItem('Madinah_hotel_id');
    localStorage.removeItem('Madinah_imagesApiResponse');
    localStorage.removeItem('Mecca_imagesApiResponse');
    localStorage.removeItem('Mecca_hotel_id');
    localStorage.removeItem('huz_token');

};
