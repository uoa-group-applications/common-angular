/**
 * Form field directive:
 *
 * <div form-field error='error text' label='label name' hint='' rest-bind='' rest-value='{{var}}' mandatory='true'>
 *     form element html
 * </div form-field>
 *
 * field descriptions:
 * --
 * error: is shown when field is incorrect
 * label: the label for this field
 * hint: is the small gray text under the field explaining the label more
 * mandatory: if specified a red asterisk is added to the field
 * rest-bind: specify this to use the formUtils.js functionalities
 * rest-value: rest bind uses the best guess for the form fields' value, but sometimes it's not good enough, in that
 *             case specify the value that should be picked up in this attribute as a model variable.
 *
 * outputted HTML:
 * --
 *
 * <div class='row clearfix'>
 *     <label>label<br/>
 *            <span class="hint">hint</span>
 *            <span class="mandatory">mandatory field</span>
 *       </label>
 *       <div class="input">
 *           {element content html}
 *           <p class="err">error message</p>
 *       </div>
 * </div>
 */
UOA.common.directive("uoaFormField", function () {

        return {
            /**
             * Has its own scope
             */
            scope : true,

            /**
             * An attribute directive
             */
            restrict : 'A',

            /**
             *
             * @param element
             * @param attrs
             */
            compile : function(element, attrs) {

                var errorHtml = '';
                if (_.isDefined(attrs.error) || _.isDefined(attrs.restBind)) {

                    // has rest-form binding?
                    var restInstruction = '';
                    if (_.isDefined(attrs.restBind)) {
                        restInstruction = ' data-rest-id="' + attrs.restBind + '"';
                    }
                    errorHtml = ['<p class="err"', restInstruction, '>', attrs.error, '</p>'].join("");
                }

                var hintHtml = '';
                if (_.isDefined(attrs.hint)) {
                    hintHtml = ['<br/><span class="hint">', attrs.hint ,'</span>'].join("");
                }

                var mandatoryHtml = '<span class="not-mandatory">&nbsp;</span>';
                if (_.isDefined(attrs.mandatory) && attrs.mandatory === "true" ) {
                    mandatoryHtml = '<span class="mandatory">Mandatory field</span>';
                }

                var html =
                    [
                        '<div class="row clearfix">',
                            '<label>',
                                attrs.label,
                                mandatoryHtml,
                                hintHtml,
                            '</label>',
                            '<div class="input">',
                                element.html(),
                                errorHtml,
                            '</div>',
                        '</div>'
                    ].join("");

                element.replaceWith(html);
            }
        };
    });

