const defaults = {
    title: undefined,
    parent: null,
    message: '',
    type: '',
    showClose: true,
    modalFade: true,
    lockScroll: true,
    closeOnClickModal: true,
    closeOnPressEscape: true,
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonType: 'primary',
    cancelButtonType: '',
    confirmButtonDisabled: false,
    cancelButtonDisabled: false,
    confirmButtonPosition: 'right',
    confirmButtonHighlight: false,
    cancelButtonHighlight: false,
    confirmButtonLoading: false,
    cancelButtonLoading: false,
    confirmButtonText: '',
    cancelButtonText: '',
    confirmButtonClass: '',
    cancelButtonClass: '',
    beforeClose: null
};

import Vue from 'vue';
import GMessageBox from './g-message-box';
import { merge } from '@/utils/assist';

const MessageBoxConstructor = Vue.extend( GMessageBox );

let currentMsg, instance;
let msgQueue = [];  // 可能在同一时间内弹出多个对话框，需要保证每个对话框的事件都被执行

const defaultCallback = action => {
    if ( currentMsg ) {
        let callback = currentMsg.callback;
        if ( typeof callback === 'function' ) {
            callback( action );
        }
        if ( currentMsg.resolve ) {
            let $type = currentMsg.options.$type;
            if ( $type === 'confirm' || $type === 'prompt' ) {
                if ( action === 'confirm' ) {
                    currentMsg.resolve( action );
                } else if ( action === 'cancel' && currentMsg.reject ) {
                    currentMsg.reject( action );
                }
            } else {
                currentMsg.resolve( action );
            }
        }
    }
};

const initInstance = () => {
    instance = new MessageBoxConstructor( {
        el: document.createElement( 'div' )
    } );

    instance.callback = defaultCallback;
};

const showNextMsg = () => {
    if ( !instance ) {
        initInstance();
    }
    instance.action = '';

    if ( !instance.visible || instance.closeTimer ) {
        if ( msgQueue.length > 0 ) {
            currentMsg = msgQueue.shift();

            let options = currentMsg.options;
            for ( let prop in options ) {
                if ( options.hasOwnProperty( prop ) ) {
                    instance[ prop ] = options[ prop ];
                }
            }
            if ( options.callback === undefined ) {
                instance.callback = defaultCallback;
            }

            let oldCb = instance.callback;
            instance.callback = ( action, instance ) => {
                oldCb( action, instance );
                showNextMsg();
            };
            delete instance.$slots.default;
            [ 'modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape' ].forEach( prop => {
                if ( instance[ prop ] === undefined ) {
                    instance[ prop ] = true;
                }
            } );

            if ( instance.parent && instance.parent instanceof HTMLElement ) {
                instance.modalAppendToBody = false;
                instance.parent.appendChild( instance.$el );
            } else {
                document.body.appendChild( instance.$el );
            }

            Vue.nextTick( () => {
                instance.visible = true;
            } );
        }
    }
};

const MessageBox = function ( options, callback ) {
    if ( typeof options === 'string' ) {
        options = {
            message: options
        };
        if ( arguments[ 1 ] ) {
            options.title = arguments[ 1 ];
        }
        if ( arguments[ 2 ] ) {
            options.type = arguments[ 2 ];
        }
    } else if ( options.callback && !callback ) {
        callback = options.callback;
    }

    return new Promise( ( resolve, reject ) => {
        msgQueue.push( {
            options: merge( {}, defaults, MessageBox.defaults, options ),
            callback: callback,
            resolve: resolve,
            reject: reject
        } );

        showNextMsg();
    } );
};

MessageBox.setDefaults = defaults => {
    MessageBox.defaults = defaults;
};

MessageBox.alert = ( message, title, options ) => {
    if ( typeof title === 'object' ) {
        options = title;
        title = '';
    }
    return MessageBox( merge( {
        title: title,
        message: message,
        $type: 'alert',
        closeOnPressEscape: false,
        closeOnClickModal: false
    }, options ) );
};

MessageBox.confirm = ( message, title, options ) => {
    if ( typeof title === 'object' ) {
        options = title;
        title = '';
    }
    return MessageBox( merge( {
        title: title,
        message: message,
        $type: 'confirm',
        showCancelButton: true
    }, options ) );
};

MessageBox.close = () => {
    instance.visible = false;
    msgQueue = [];
    currentMsg = null;
};

export default MessageBox;
export { MessageBox };
