import Vue from 'vue'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入树形选择器
import ZKTable from 'vue-table-with-tree-grid'

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(ZKTable)