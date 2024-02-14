export default function DragAndDrop(event, element) {
  const closest = document.elementFromPoint(event.clientX, event.clientY);
  const { top } = closest.getBoundingClientRect();

  if (closest.classList.contains('list_item')) {
    if (event.pageY > window.scrollY + top + closest.offsetHeight / 2) {
      closest.closest('.task_list').insertBefore(element, closest.nextElementSibling);
    } else {
      closest.closest('.task_list').insertBefore(element, closest);
    }
  } else if (closest.classList.contains('task_list')) {
    closest.append(element);
  }
}
