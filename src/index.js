import '../static/icon/iconfont.css'
import Breadcrumb from './components/breadcrumb'
import Button from './components/button'
import ColorBar from './components/color-bar'
import ColorPicker from './components/color-picker'
import ColorBarPicker from './components/color-bar-picker'
import Dropdown from './components/dropdown'
import Input from './components/input'
import Message from './components/message'
import MessageBox from './components/message-box'
import Notification from './components/Notification'
import Scrollbar from './components/scrollbar'

const components = [
    Breadcrumb,
    Button,
    ColorBar,
    ColorPicker,
    ColorBarPicker,
    // Dropdown,
    Input,
    Message,
    MessageBox,
    Notification,
    // Scrollbar
];

const GlobalComponents = {
    install ( Vue, opts = {} ) {
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.prototype.$notify = Notification;
        Vue.prototype.$message = Message;
    }
}

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

// if ( typeof window !== 'undefined' && window.Vue ) {
//     install( window.Vue );
// };

export {
    install,
    GlobalComponents,
	Breadcrumb,
    Button,
    ColorBar,
    ColorPicker,
    ColorBarPicker,
    // Dropdown,
    Input,
    Message,
    MessageBox,
    Notification,
    // Scrollbar
}
