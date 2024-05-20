/** IntersectionObserver: 用于监听一个元素的可见比例（一个DOM元素被另一个DOM元素遮挡百分比）变化。 */
export const useIntersectionObserver = (target: HTMLElement, rootTarget?: HTMLElement) => {
  const options = {
    root: rootTarget, // 相对于某个元素进行遮挡计算 - 可缺省 -- 如果不传值默认为最近的可滚动的元素?(目前观察结果可能是)
    // rootMargin: '0px', // 进行计算的边界范围，通过rootMargin可以实现提前计算或延迟计算（相对于root原本尺寸）的效果 - 可缺省
    threshold: 0, // 触发callback时的遮挡比例，0为全部被遮挡，0.5代表元素被遮挡50%时触发callback。由于浏览器事件循环机制的影响，callback触发时遮挡比例通常不会是精确的50%。
  };

  const intersectionObserver = new IntersectionObserver((entries, observer) => {
    console.log('entries', entries);
    // 和MutationObserver相同，也是产生一个array
    entries.forEach(entry => {
      console.log('entry:', entry, observer, entry.isIntersecting); //  entry.isIntersecting 如果不传递root，当目标元素位与可视范围内则值为true 滚动至范围外则为false
    });
  }, options);

  intersectionObserver.observe(target);
};

/* 一个使用场景示例：
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sticky Header with Shadow on Intersection</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    header {
      height: 80px;
      background-color: #3498db;
      color: white;
      text-align: center;
      line-height: 80px;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-shadow {
      transition: box-shadow 0.3s ease;
    }

    .header-shadow.shadow {
      box-shadow: 0 2px 5px black;
    }

    section {
      height: 1000px;
      background-color: #ecf0f1;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div id="guard"></div>
  <header id="sticky-header" class="header-shadow">Sticky Header</header>

  <section>
    <p>向下滚动触发sticky时展示shadow</p>
  </section>

  <script>
    const header = document.getElementById('sticky-header');
    const section = document.querySelector('section');

    const options = {
      threshold: 1
    };
    //guard滚动到可视区域以外时认为触发了shadow
    const intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          header.classList.remove('shadow');
        } else {
          header.classList.add('shadow');
        }
      });
    }, options);

    intersectionObserver.observe(document.getElementById('guard'));
  </script>

</body>
</html>
*/
