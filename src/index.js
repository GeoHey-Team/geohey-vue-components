import Breadcrumb from './components/breadcrumb'
import Button from './components/button'
import ColorPicker from './components/color-picker'
import Dropdown from './components/dropdown'
import Input from './components/input'
import Message from './components/message'
import MessageBox from './components/message-box'
import Notification from './components/Notification'
import Scrollbar from './components/scrollbar'

const components = [
    Breadcrumb,
    Button,
    ColorPicker,
    // Dropdown,
    Input,
    Message,
    MessageBox,
    Notification,
    // Scrollbar
];

const install = function ( Vue, opts = {} ) {

    components.map( component => {
        Vue.component( component.name, component );
    } );

    Vue.prototype.$msgbox = MessageBox;
    Vue.prototype.$alert = MessageBox.alert;
    Vue.prototype.$confirm = MessageBox.confirm;
    Vue.prototype.$prompt = MessageBox.prompt;
    Vue.prototype.$notify = Notification;
    Vue.prototype.$message = Message;
};

if ( typeof window !== 'undefined' && window.Vue ) {
    install( window.Vue );
};

export {
	install,
    Breadcrumb,
    Button,
    ColorPicker,
    Dropdown,
    Input,
    Message,
    MessageBox,
    Notification,
    Scrollbar
};
