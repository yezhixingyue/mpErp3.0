# Observer
作用、用法、应用场景

## 1. MutationObserver

MutationObserver用于监听DOM对象的变更（包括子节点），当节点属性发生变化，或执行增删改操作时执行对应的callback。

MutationObserver为我们提供了一种十分方便的监听DOM变化的方式。

对于需要监听DOM变化的场景可考虑使用MutationObserver


## 2. IntersectionObserver

IntersectionObserver用于监听一个元素的可见比例（一个DOM元素被另一个DOM元素遮挡百分比）变化。

场景：
我们有一个通过sticky固定在屏幕顶部的header元素，我们希望在触发sticky时给header加一个shadow（很多table都有这样的功能），此时可使用IntersectionObserver
-- 设置一个在上方紧挨着的dom元素作为目标


## 3. ResizeObserver

ResizeObserver是用于监听DOM尺寸变化的observer，当DOM尺寸变化是执行callback


## 4. PerformanceObserver

PerformanceObserver用于监听浏览器的performance事件，方便在performance事件触发时作统一处理。

## 5. ReportingObserver

ReportingObserver用于监听浏览器报告的事件，例如废弃API，过时特性，网络错误。做监控SDK的同学应该经常能用到，日常业务代码用的比较少。
