/*
 * Copyright@2009 Daniel Petrovic <daniel-dev@hotmail.de>
 *
 * BSD License
 *
 * Redistribution and use in source and binary forms,
 *  with or without modification, are permitted provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer. 
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * - Neither the name of The author nor the names of its contributors may be used
 *   to endorse or promote products derived from this software
 *   without specific prior written permission. 
 * 
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
 * OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE 
 * ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHOR AND CONTRIBUTORS BE 
 * IABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES 
 * (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var DatePicker = new Class({

    Implements: [Options, Events],
    
    options: {
        pickerClass: 'datepicker',
        inputClass: 'dateinput',
        month: 0,
        year: 0 
       },
    
    initialize: function(attachTo, options) {
        var me = this, 
            now = new Date();
        
        if (typeof(attachTo) == 'string') {
            attachTo = document.id(attachTo);
        }
           
        this.setOptions(options);
        if (!this.options.month) {
            this.options.month = now.get('month');
        }
        if (!this.options.year) {
            this.options.year = now.get('year');
        }
        this._month = this.options.month;
        this._year = this.options.year;
        this.constructPicker();
        
        var elements = this.elements = Array.from(attachTo);
        elements.each(function(element) {
             me.attachTo(element);   
        });
        
    },
    
    attachTo: function(element) {
       var me = this;
       if (!element.isAttached) {
            // process event attachment and add element to attached elements
             element.addEvent('click', function(el) {
               
                 me.elements.each(function(el) { el.removeClass('active');});
                 if (!element.hasClass(me.options.inputClass)) {
                    element.addClass(me.options.inputClass);
                 }
                 element.addClass('active');
                 me.show(element);
                 
                                    
            });
            
             element.isAttached = true;
            
        }
       
        
    },
    
    detachFrom: function(element) {
      element.isAttached = false;
    },
    
    constructPicker: function() {
        
        var options = this.options;
        var picker = this.picker = new Element('table', {
            class: options.pickerClass,
            styles: {
                 left: 0,
                 top: 0,
                position: 'absolute',
                float: 'left',
                 display: 'none',
                 zIndex: 100
             }
        });
        
        this._constructHeader();
        this._constructBody();
        this._constructFooter();
        picker.inject(document.body);
        this._addEvents();
 },
    
    resetPicker: function() {
        var me = this;
       
        this._month = this.getMonth();
        this._year = this.getYear();
        
        this.destroy();
        this.constructPicker();
        this.elements.each(function(el) {
            if (el.hasClass('active')) {
                me.show(el);
                return;
            }
        });
       
    },
    
    destroy: function() {
        this.picker.destroy();
    },
    
    close: function() {
        this.picker.setStyle('display', 'none');
    },
    
    getMonth: function() {
       var month = this._pickerHeader.getElement('.picker-month').get('value');
        return parseInt(month, 10);
    },
    
    getYear: function() {
        var year = this._pickerHeader.getElement('.picker-year').get('value');
        return parseInt(year, 10);
    },
    
    show: function(element) {
        var ePos = element.getPosition(),
            eSize = element.getSize();
        this.picker.setStyle('left', ePos.x + 'px');
        this.picker.setStyle('top', (ePos.y + eSize.y) + 'px');
        this.picker.setStyle('display', 'block');
    },
    
    _constructHeader: function() {
         var pickerHeader = this._pickerHeader = new Element('thead', {
            class: 'picker-header'
         }).inject(this.picker);
        
        var headRow = new Element('tr').inject(pickerHeader);
      
   
       
        var headCell = new Element('td', {colspan: 7}).inject(headRow);
        
        var selYear = this._selectYear = new Element('select', {class: 'picker-year'}).inject(headCell);
       
        for (nYear = 1984; nYear <= 2020; ++nYear) {
            var opt = new Element('option', {html: nYear}).inject(selYear);
            if (nYear == this._year) {
                opt.set('selected', 'selected');
            }
            
        }
        
        
        var selMonth = this._selectMonth = new Element('select', { class: 'picker-month'}).inject(headCell);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
       for (var i = 0; i < months.length; ++i) {
           var opt = new Element('option', {html: months[i], value: i}).inject(selMonth);
           if (i == this._month) {
               opt.set('selected', 'selected');
           }
            
        }
        
    },
    
    _constructBody: function() {
        var year = this._selectYear.get('value');
        var month = this._selectMonth.get('value');
        var date = this._constructDate(year, month, 1);
        
         var pickerBody = this._pickerBody = new Element('tbody', {
            class: 'picker-body',
        }).inject(this.picker);
        
        var days = ['Son', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var dayRow = new Element('tr').inject(pickerBody);
        for (var i = 0; i < days.length; ++i) {
            var dayCell = new Element('td', {html: days[i] + ' '}).inject(dayRow);
        }
                                 
        
        
        var row = new Element('tr').inject(pickerBody);
        var counter = 0;

        while (counter < date.get('day')) {
            ++counter;
             new Element('td').inject(row);
        }
        
        while (date.get('month') == month) {
            var html = '<span>' + date.get('date') + '</span>';
            var cell = new Element('td', {class: 'cell', html: html}).inject(row);
             date.increment('day', 1);
            
             ++counter;
            
            if (counter % 7 == 0) {
                row = new Element('tr').inject(pickerBody);
            }
           
        }
              
        
    },
    
    _constructFooter: function() {
        /*
         var pickerFooter = this._pickerFooter = new Element('tfoot', {
            
        }).inject(this.picker);
        */
    },
    
    // year: 1998
    // month: 0-11
    // return Date
    _constructDate: function(year, month, d) {
        var date = new Date();
        date.set('year', year);
        date.set('month', month);
        
        if (!d) {
            d = 1;
        }
        date.set('date', d);
        return date;
    },
    
    _addEvents: function() {
        var me = this;
        this._pickerBody.getElements('td.cell').addEvent('click', function(e) {
                  var d = parseInt(e.target.innerHTML, 10),
                      month = 0,
                      year = 0;
                  month = me.getMonth();
                  year = me.getYear();
                  var date = me._constructDate(year, month, d);
                  me._displayDate(date);
                  me.close();
                  return false;
            
                
            });
        
        this._pickerHeader.getElements('.picker-year, .picker-month').addEvent('change', function(e) {
            
            me.resetPicker();
        });
       
    },
    
    _displayDate: function(date) {
        this.elements.each(function(el) {
            if (el.hasClass('active')) {
                el.set('value', date.format('%d.%m.%Y'));
            }
        });
    }
});
