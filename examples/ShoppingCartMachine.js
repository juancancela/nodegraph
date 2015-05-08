var assert = require("assert");
var Machine = require('../index').Machine;
var Transition = require('../index').Transition;
var Operation = require('../index').Operation;
var Property = require('../index').Property;

/**
 * In this example, it will be modelized a fictional shopping cart resource as a Machine.
 * Shopping Cart resource has four states:
 * -> NON_PRICEABLE (Initial State) : This state, which is the initial one, represents an empty cart, thus, we
 *    establish such a cart as impossible to be priced.
 * -> PRICEABLE : After an Item is added, cart is priceable, and in that case state moves to PRICEABLE
 * -> PRICED : If a PRICEABLE cart gots priced, then it gets PRICED state
 * -> CHECKED_OUT : Finally, if a PRICED cart is checked out, it moves to CHECKED_OUT state.
 *
 * [NON_PRICEABLE] ---addItem---> [PRICEABLE] ---price---> [PRICED] ---checkOut---> [CHECKED_OUT]
 *
 * Machine will have three operations : addItem, price and checkOut.
 * Machine will have three simple transitions : NON_PRICEABLE->PRICEABLE, PRICEABLE->PRICED, PRICED->CHECKED_OUT
 *
 * !Note this first example is a rather simplistic one, and carts will have just one item. Next examples will contain
 * much more complex flows (operating with lists, mutable transition states, immutable states, error handling, etc)
 *
 * @constructor
 */
function ShoppingCartMachineExampleSimplest(){

    var addItemOperation = new Operation("addItem", function(machine, parameters, finalState, cb){
        var err = null;
        machine.getProperties()["item"].setValue("Argentina->Brasil");
        if(!err){
            cb(null, machine.setCurrentState(finalState));
        } else {
            cb(err, null);
        }
    });

    var priceOperation = new Operation("price", function(machine, parameters, finalState, cb){
        var err = null;
        machine.getProperties()["priced"].setValue(true);
        if(!err){
            cb(null, machine.setCurrentState(finalState));
        } else {
            cb(err, null);
        }
    });

    var checkOutOperation = new Operation("checkOut", function(machine, parameters, finalState, cb){
        var err = null;
        machine.getProperties()["checkedOut"].setValue(true);
        if(!err){
            cb(null, machine.setCurrentState(finalState));
        } else {
            cb(err, null);
        }
    });

    var fromNonPriceableToPriceable = new Transition("NON_PRICEABLE", "PRICEABLE", addItemOperation);
    var fromPriceableToPriced = new Transition("PRICEABLE", "PRICED", priceOperation);
    var fromPricedToCheckedOut = new Transition("PRICED", "CHECKED_OUT", checkOutOperation);

    var shoppingCartMachine = new Machine("Shopping Cart Machine", "NON_PRICEABLE",
        [fromNonPriceableToPriceable,fromPriceableToPriced,fromPricedToCheckedOut], null);

    shoppingCartMachine.addProperty(new Property("item", null, null));
    shoppingCartMachine.addProperty(new Property("priced", false, null));
    shoppingCartMachine.addProperty(new Property("checkedOut", false, null));

    return shoppingCartMachine;
}

/**
 * Public Interface
 * @type {{ShoppingCartMachineExampleSimplest: ShoppingCartMachineExampleSimplest}}
 */
module.exports = {
    ShoppingCartMachineExampleSimplest : ShoppingCartMachineExampleSimplest
};