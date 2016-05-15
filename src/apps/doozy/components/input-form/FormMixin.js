import React from 'react';
import those from 'those';

var FormMixin = {
    /*************************************************************
     * COMPONENT LIFECYCLE
     *************************************************************/
    propTypes: {
        // OPTIONAL
        bindingContext: React.PropTypes.any,
        bindingPath: React.PropTypes.string,
        field: React.PropTypes.string,
        validate: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.arrayOf(React.PropTypes.func)
        ]),
    },

    /*************************************************************
     * PUBLIC FORM API METHODS
     *************************************************************/
    /**
     * Call getErrors and return true if no errors exist, else false.
     * NOTE: getErrors modifies form state (errors) whenever it is called.
     */
    isValid: function () {
        var errors = this.getErrors(this.getForm());

        // If no errors in array, then it is valid
        return errors.length === 0;
    },
    
    /**
     * Recurse through all forms and input children and call
     * input method to detect if the value has changed.
     * NOTE: Once an input reports that it has changed, the short circuit
     * prevents calling the method on any more inputs, however, the
     * forEach loop continues, so perhaps we can replace 'forEach'
     * with a method that can abort/break the iteration.
     */
    hasChanged: function () {
        var hasChanged = false;

        // Perform child validations
        this.getInputRefs().forEach(function (formInput) {
            // If this is a collection based form
            if (formInput && formInput.hasCollectionChanged) {
                // Handle Input Collection
                hasChanged = hasChanged || formInput.hasCollectionChanged();
            }
            
            // Standard Form or Input Recursion
            if (formInput && typeof formInput.hasChanged === 'function') {
                hasChanged = hasChanged || formInput.hasChanged();
            }
        });
        
        // Return whether any fields in the form have changed
        return hasChanged;
    },

    /**
     * Recurse through all forms and input children and call
     * form and input methods to validate the form values, and
     * return the list of errors that are detected.
     */
    getErrors: function (form) {
        var error;
        var errors = [];

        // Perform child validations
        this.getInputRefs().forEach(function (formInput) {

            // Child is a Form
            if (formInput && typeof formInput.getErrors === 'function') {

                // Recursively get child form errors and concatenate with the parent
                errors = errors.concat(formInput.getErrors(form));
            }
            // Child is an Input Control
            else if (formInput && formInput.props.validate) {

                // Wrap the validate property in an array if is just a single function
                var fieldValidations = typeof formInput.props.validate === 'function' ? [formInput.props.validate] : formInput.props.validate || [];

                // Iterate through field-level validation functions and collect errors
                fieldValidations.forEach(function (validate) {

                    // Get current form field value
                    var fieldValue = form;
                    var path = formInput.props.fieldPath.split('.');
                    path.forEach(function (prop) {
                        if (formInput.props.rowIndex !== undefined && Object.prototype.toString.call(fieldValue[prop]) === '[object Array]') {
                            fieldValue = those(fieldValue[prop]).first({ _rowIndex: formInput.props.rowIndex });
                        }
                        else {
                            fieldValue = fieldValue[prop];
                        }
                    });

                    // Validate
                    error = validate(fieldValue, formInput.props.label);
                    if (error) {
                        errors.push(error);
                    }
                });
            }
        });

        // Form-scope validations (only if all input-scope validation succeeded)
        if (errors.length === 0 && this.props.validations) {

            // Wrap the validate property in an array if is just a single function
            var formValidations = typeof this.props.validate === 'function' ? [this.props.validate] : this.props.validate || [];

            // Iterate through form-level validation functions and collect errors
            formValidations.forEach(function (validate) {
                error = validate(form, this.props.label);
                if (error) {
                    errors.push(error);
                }
            });
        }

        // Set the error state
        if (this.isMounted()) {
            this.setState({
                errors: errors
            });
        }

        return errors;
    },

    /**
     * Recurse through all forms and input children and
     * collect the current input values into a single object
     * mapped to the field values.
     */
    getForm: function () {
        var obj = {};
        this.getInputRefs().forEach(function (formInput) {
            if (typeof formInput.getForm === 'function') {
                // Get Form from Child Form
                var groupForm = formInput.getForm();

                // Group form returns as an array with a single item to signify it should be merged as an array
                if (groupForm[formInput.props.field] && groupForm[formInput.props.field].length && groupForm[formInput.props.field].length === 1) {
                    groupForm = groupForm[formInput.props.field][0];

                    var rowIndex;
                    if (formInput.props.rowIndex !== undefined) {
                        rowIndex = formInput.props.rowIndex;
                    }
                    else if (formInput.props.bindingContext && formInput.props.bindingContext._rowIndex !== undefined) {
                        rowIndex = formInput.props.bindingContext._rowIndex;
                    }

                    if (obj[formInput.props.field] && obj[formInput.props.field].length) {
                        var arrayItem = those(obj[formInput.props.field]).first({ _rowIndex: rowIndex });
                        if (arrayItem) {
                            Object.assign(arrayItem, groupForm);
                        }
                    }
                    else {
                        obj[formInput.props.field] = obj[formInput.props.field] || [];
                        obj[formInput.props.field].push(groupForm);
                    }
                }
                else {
                    obj = Object.assign({}, obj, groupForm);
                }
            }
            else if (formInput && formInput.props.field && formInput.current !== undefined && formInput.current.value !== undefined) {
                var value = formInput.props.translate && typeof formInput.props.translate === 'function' ? formInput.props.translate(formInput.current.value) : formInput.current.value;
                // Handle InputTable Row Inputs by placing in an array
                if (formInput.props.rowIndex !== undefined && this.props.field) {
                    // Ensure collection exists
                    obj[this.props.field] = obj[this.props.field] || [];
                    
                    var item = those(obj[this.props.field]).first({ _rowIndex: formInput.props.rowIndex });
                    if (!item) {
                        item = { _rowIndex: formInput.props.rowIndex };
                        obj[this.props.field].push(item);
                    }
                    item[formInput.props.field] = value;
                }
                else { // Set Form Value
                    obj[formInput.props.field] = value;
                }
            }
        }.bind(this));
        return obj;
    },
    
    /**
     * Pass in a model and apply the form's values to it
     * by recursing through all forms and input children
     * making each input responsible for applying its value
     * to the appropriate model prop and index.
     */
    applyForm: function (model, rootPath) {
        if (typeof this.applyCollectionForm === 'function') {
            this.applyCollectionForm(model, rootPath);
        }
        this.getInputRefs().forEach(function (formInput) {
            var bindingPath = this.props.bindingPath || this.props.field;
            if (typeof formInput.applyForm === 'function') {
                formInput.applyForm(model, rootPath ? rootPath + '.' + bindingPath : bindingPath);
            }
            else if (typeof formInput.applyValue === 'function') {
                formInput.applyValue(model, rootPath ? rootPath + '.' + bindingPath : bindingPath);
            }
        }.bind(this));
    },
    
    /**
     * Recurse through all forms and input children
     * and call input method to reset the value to
     * its props defaultValue
     */
    resetForm: function () {
        if (typeof this.resetCollectionForm === 'function') {
            this.resetCollectionForm();
        }
        this.getInputRefs().forEach(function (formInput) {
            if (typeof formInput.resetForm === 'function') {
                formInput.resetForm();
            }
            else if (typeof formInput.resetValue === 'function') {
                formInput.resetValue();
            }
        });
    },

    /*************************************************************
     * PRIVATE FORM API METHODS
     *************************************************************/

    /**
     * Recurse through all forms and input children
     * and call input method to check if any of its
     * key properties (items, visible, defaultValue)
     * are functions that can be passed the input and 
     * form state to return a value
     */
    relayDependencyValueChange: function (frmChg) {
        this.getInputRefs().forEach(function (formInput) {
            if (typeof formInput.relayDependencyValueChange === 'function') {
                formInput.relayDependencyValueChange(frmChg);
            }
            else if (typeof formInput.handleDependencyValueChange === 'function' && (frmChg.id === null || isDepend(formInput.props.dependOn, frmChg.id))) {
                formInput.handleDependencyValueChange(frmChg);
            }
        });
    },

    getInputRef: function (id, input) {
        if (id) {
            this.inputRefs = this.inputRefs || {};
            if (input === null) {
                delete this.inputRefs[id];
            }
            else if (!input.nodeName) {
                this.inputRefs[id] = input;
            }
        }
    },

    getInputRefs: function () {
        var refs = [];
        for (var prop in this.inputRefs) {
            if (this.inputRefs.hasOwnProperty(prop) && typeof this.inputRefs[prop] !== undefined && this.inputRefs[prop] !== null) {
                refs.push(this.inputRefs[prop]);
            }
        }
        return refs;
    },

    getChildProps: function (child, context) {
        /**
         * Ensure somewhere along the pipeline of forms,
         * the input's ref is bound to FormMixin.getInputRef
         * so we can reference the inputs to get the form values and status
         */
        var ref, baseRef, appendRowIndex;
        baseRef = child.props.field || child.props.id;
        appendRowIndex = this.props.rowIndex ? '_' + this.props.rowIndex : '';
        if (context && context._rowIndex !== undefined) {
            appendRowIndex = '_' + context._rowIndex;
        }
        else if (this.props.bindingContext && this.props.bindingContext._rowIndex !== undefined) {
            appendRowIndex = '_' + this.props.bindingContext._rowIndex;
        }

        // Hook into parent form's getInputRef
        if (this.props.ref) {
            ref = this.props.ref.bind(null, baseRef + appendRowIndex);
        }

        // Hook into this form's getInputRef
        if (!ref) {
            ref = this.getInputRef.bind(null, baseRef + appendRowIndex);
        }

        // Define base props
        var childProps = {
            fieldPath: this.props.field ? this.props.field + '.' + child.props.field : child.props.field,
            bindingContext: context || child.props.bindingContext || this.props.bindingContext,
            ref: ref,
            key: baseRef + appendRowIndex,
            onChange: this.handleChange || this.props.onChange
        };

        // Inherit label span if it has a label and no overriding prop is set
        if (this.props.labelSpan && child.props.labelSpan === undefined) {
            childProps.labelSpan = this.props.labelSpan;
        }
         if (this.props.labelStyle && child.props.labelStyle === undefined) {
            childProps.labelStyle = this.props.labelStyle;
        }

        // Inherit row index if not already set
        if (context && context._rowIndex !== undefined && child.props.rowIndex === undefined) {
            childProps.rowIndex = context._rowIndex;
        }
        else if (this.props.bindingContext && this.props.bindingContext._rowIndex !== undefined) {
            childProps.rowIndex = this.props.bindingContext._rowIndex;
        }
        else if (this.props.rowIndex !== undefined && child.props.rowIndex === undefined) {
            childProps.rowIndex = this.props.rowIndex;
        }

        // Set default value from binding path if we have a binding path and context
        var bindingPath = child.props.bindingPath || child.props.field;
        if (!child.props.defaultValue && bindingPath && childProps.bindingContext) {
            childProps.defaultValue = this.getBindingValue(childProps.bindingContext, bindingPath);
        }

        return childProps;
    },

    getFormSiblingProps: function (sibling, context) {
        /**
         * Ensure somewhere along the pipeline of forms,
         * the input's ref is bound to FormMixin.getInputRef
         * so we can reference the inputs to get the form values and status
         */
        var ref, appendRowIndex;
        if (context && context._rowIndex !== undefined) {
            appendRowIndex = '_' + context._rowIndex;
        }

        // Hook into parent form's getInputRef
        if (this.props.ref) {
            ref = this.props.ref.bind(null, sibling.props.field + appendRowIndex);
        }

        // Hook into this form's getInputRef
        if (!ref) {
            ref = this.getInputRef.bind(null, sibling.props.field + appendRowIndex);
        }

        // Define base props
        var childProps = {
            field: sibling.props.field || '',
            fieldPath: sibling.props.field || '',
            bindingContext: context || sibling.props.bindingContext,
            ref: ref,
            key: sibling.props.field + appendRowIndex,
            onChange: sibling.handleChange || sibling.props.onChange,
        };

        // Inherit row index if not already set
        if (context && context._rowIndex) {
            childProps.rowIndex = context._rowIndex;
        }

        return childProps;
    },

    getBindingValue: function (obj, path) {
        var copy = Object.assign({}, obj);
        path.split('.').forEach(function (prop) {
            // While traversing, treat any undefined as blank objects
            if (copy[prop] === undefined) {
                copy[prop] = {};
            }
            copy = copy[prop];
        });
        return copy;
    },

    setBindingValue: function (obj, path, val) {
        var objPath = obj;
        if (path.indexOf('.') > -1) {
            path.split('.').slice(0, -1).forEach(function (prop) {
                // While traversing, treat any undefined as blank objects
                if (objPath[prop] === undefined) {
                    objPath[prop] = {};
                }
                objPath = objPath[prop];
            });
            objPath[path.split('.').slice(-1)] = val;
        }
        else {
            objPath[path] = val;
        }
    },
    
};

/**
 * Return true if the dependOn string or array matches the id of the latest changed property
 */
var isDepend = function (dependOn, id) {
    if (dependOn === undefined) {
        return false;
    }
    if (typeof dependOn === 'string') {
        return dependOn === '*' || dependOn === id;
    }
    else {
        // Array
        return dependOn.indexOf(id) > -1;
    }
};

export default FormMixin;
