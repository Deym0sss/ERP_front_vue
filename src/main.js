import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import components from "@/components/UI";
import router from "./router/router";
import Benchmark from "benchmark";

// Создаем приложение Vue
const app = createApp(App);

// Регистрируем компоненты
components.forEach((component) => {
  app.component(component.name, component);
});

// Добавляем бенчмарк после монтирования
const suite = new Benchmark.Suite();

// Тест на рендеринг компонента App.vue
suite
  .add("Vue render App.vue", function () {
    const div = document.createElement("div");
    const appInstance = createApp(App); // Создаём экземпляр приложения Vue
    appInstance.mount(div); // Монтируем компонент в div
    appInstance.unmount(); // Демонтируем компонент
  })
  .on("cycle", function (event) {
    // Выводим результаты каждого цикла теста
    console.log(String(event.target));
  })
  .on("complete", function () {
    // Сообщаем о завершении тестирования
    console.log("Benchmark finished.");
  })
  .run(); // Запускаем тесты

// Монтируем приложение
app.use(Antd).use(router).mount("#app");
