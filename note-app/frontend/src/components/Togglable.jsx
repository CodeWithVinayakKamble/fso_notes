import { useState, useImperativeHandle } from "react";

const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    // display : none means inivisiable from screen / display : '' means set to its default like {block or anything}
    const hideWhenVisiable = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => (setVisible(!visible))

    useImperativeHandle(props.ref, () => {
        return { toggleVisibility }
    })

    return (
        <div>
            <div style={hideWhenVisiable}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>

            <div style={showWhenVisible}>
                {props.children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>

        </div>
    )
}

export default Togglable