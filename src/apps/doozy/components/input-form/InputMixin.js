import React from 'react';
import those from 'those';

var InputMixin = {
    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    propTypes: {
        // REQUIRED            
        field: React.PropTypes.string.isRequired,

        // OPTIONAL
        bindingContext: React.PropTypes.any,
        bindingPath: React.PropTypes.string,
        defaultValue: React.PropTypes.any,
        dependOn: React.PropTypes.oneOfType([
            React.PropTypes.string, 
            React.PropTypes.array
        ]),
        readOnly: React.PropTypes.oneOfType([
            React.PropTypes.func, // callback signature: input::ReactElement, frmChg::object, update::func<bool>
            React.PropTypes.bool
        ]),
        validate: React.PropTypes.func,
        visible: React.PropTypes.oneOfType([
            React.PropTypes.func, // callback signature: input::ReactElement, frmChg::object, update::func<bool>
            React.PropTypes.bool
        ])
    },

    /*************************************************************
     * VALUE CHANGE
     *************************************************************/
    /**
     * Default value provider meets simply gets the value from the DOM change event args
     */
    defaultValueProvider: function (e) {
        return e.target.value;
    },

    /**
     * Get the input event value from the value provider and set it to the current value.
     * If onChange callback exists, then call it.
     * NOTE: The callback is typically owned by a FormMixin element.
     */
    handleChange: function (e) {
        // Get the value from a value provider
        var newValue = this.valueProvider ? this.valueProvider(e) : this.defaultValueProvider(e);

        // Safely ensure current obj exists
        this.current = this.current || {};
        
        // Set new value
        this.current.value = newValue;

        // Invoke callback if 
        if (this.props.onChange) {
            this.props.onChange(newValue, this.props.field, this.props.rowIndex);
        }
    },

    /**
     * Compare default value to current value and return if it is different.
     * If defaultValue is not defined, hasChanged will always return false.
     */
    hasChanged: function () {
        return this.props.defaultValue !== undefined && this.props.defaultValue !== this.current.value;
    },

    /*************************************************************
     * FORM MIXIN PIPELINE
     *************************************************************/
    /**
     * Apply the input's current value to the appropriate mapping in the model
     * by utilizing the binding path properties.
     * This is typically called by FormMixin.applyForm.
     */
    applyValue: function (model, rootPath) {
        // Merge rootpath with bindingpath to get the absolute path
        var bindingPath = this.props.bindingPath || this.props.field;
        var path = rootPath ? rootPath + '.' + bindingPath : bindingPath;
        // Set current object ref pointing to model
        var obj = model;
        // Step through object hierarchy with the binding path 
        // and assign the current value to the last part of the path
        path.split('.').forEach(function (prop, idx, arr) {
            
            // Get item in array if obj ref is currently an array and we have a rowIndex
            if (this.props.rowIndex !== undefined && Object.prototype.toString.call(obj) === '[object Array]') {
                // Find the row in the model that matches this input's rowIndex prop
                obj = those(obj).first(function (item, midx) {
                    if (item._rowIndex !== undefined) {
                        // New rows will always have _rowIndex tagged on them
                        return item._rowIndex === this.props.rowIndex;
                    }
                    else {
                        // Original model rows may not have a _rowIndex tagged on
                        // but the rowIndex is always the same as array index in these cases
                        return midx === this.props.rowIndex;
                    }
                }.bind(this));
            }
            
            // Assign the value for the last part of the path
            if (idx === arr.length - 1) {
                obj[prop] = this.current.value;
            }
            // Set reference to prop obj ref
            else {
                obj = obj[prop];
            }
            
        }.bind(this));
    },
    
    /**
     * Apply the input's current value to the appropriate mapping
     * in the model by utilizing the binding path properties.
     * This is typically called by FormMixin.resetForm.
     */
    resetValue: function () {
        this.current.value = this.props.defaultValue;

        if (this.props.onChange) {
            this.props.onChange(this.props.defaultValue, this.props.field, this.props.rowIndex);
        }
        if (this.onValueReset) {
            this.onValueReset();
        }
    },

    /**
     * Handle the dependency value change and .
     * This is typically called by FormMixin.relayDependencyValueChange.
     */
    handleDependencyValueChange: function (frmChg) {
        // Recalculate Items input current
        if (typeof this.props.items === 'function') {
            // Invoke items function
            this.props.items(this, frmChg, function (newItems) {

                // Check if the new list contains the current value
                // If not, then set the value to the first item in
                // the list (or null if no list items)
                var matchObj = {};
                matchObj[this.props.valuePath] = this.current.value;
                if (!those(newItems).first(matchObj)) {
                    if (newItems.length > 0) {
                        this.current.value = newItems[0][this.props.valuePath];
                    }
                    else {
                        this.current.value = null;
                    }
                }

                // Set the items state
                if (this.isMounted()) {
                    this.setState({
                        items: newItems
                    });
                }
            }.bind(this));
        }
        // Recalculate Read Only input state
        if (typeof this.props.readOnly === 'function') {
            // Invoke readOnly function
            this.props.readOnly(this, frmChg, function (newReadonly) {
                // Set the readOnly state
                if (this.isMounted()) {
                    this.setState({
                        readOnly: newReadonly
                    });
                }
            }.bind(this));
        }
        // Recalculate Visible input state
        if (typeof this.props.visible === 'function') {
            // Invoke visible function
            this.props.visible(this, frmChg, function (newVisible) {
                // Set the visible state on the input container
                if (typeof this.props.handleVisible === 'function') {
                    this.props.handleVisible(newVisible);
                }
                // Set the visible state on the input (no container handling visibility)
                else if (this.isMounted()) {
                    this.setState({
                        visible: newVisible
                    });
                }
            }.bind(this));
        }
    }
};

export default InputMixin;
