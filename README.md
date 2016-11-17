# angular-hsm
hierarchical state machine ( statechart ) directives for angular.js

a simple example of a counter which increments and decrements within a range.
( note: ng-init is used just to simplify the example. controllers are preferred. )

```html
<div hsm-machine="machine" ng-init="c= {val:1}">
  <a ng-click="machine.emit('click')" href>counter {{c.val}}</a>
  <hsm-state>
    <hsm-state name="s0">
      <hsm-event on="click" run="c.val= c.val+1"></hsm-event>
      <hsm-event on="click" when="c.val > 2" goto="s1"></hsm-event>
      <span ng-if="hsmState.active">increasing</span>
    </hsm-state>
    <hsm-state name="s1">
      <hsm-event on="click" run="c.val= c.val-1"></hsm-event>
      <hsm-event on="click" when="c.val <= 0" goto="s0"></hsm-event>
      <span ng-if="hsmState.active">decreasing</span>
    </hsm-state>
  </hsm-state>
</div>
```
