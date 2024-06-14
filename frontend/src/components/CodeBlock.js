import React from 'react';
import './CodeBlock.css';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeBlock = (props) => {




  return (
    <>
      <h3 className='codeblock-h3'>Code here</h3>
      <div className="editor-container">
        <div id="editor">
          <AceEditor
            mode={props.language}
            theme="cobalt"
            // onChange={this.onChange}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{
              $blockScrolling: true
            }}
            style={{ width: '100%', height: '100%' , fontSize: '1.1rem' }}
          />
        </div>
      </div>
    </>
  )
};

export default CodeBlock;
