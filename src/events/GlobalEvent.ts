import EventEmitter from 'events';

const Events = {
    addedNewAuthorizedUserEntryEvent: 'added_new_authorized_user_entry_event',
    updateAuthorizedUserEntryEvent: 'update_authorized_user_entry',

    addedNewAuthorizedUserEvent: 'added_new_authorized_user_event',
    updateAuthorizedUserEvent: 'update_authorized_user',

    addedNewDayRecordEvent: 'added_new_day_record_event',
    updateDayRecord: 'update_day_record',

    addedNewDetectionEvent: 'added_new_detection_event',
    updateCurrentDayDetection: 'update_current_day_detection',
};

const MyEvent: EventEmitter = new EventEmitter();

export { Events, MyEvent };
