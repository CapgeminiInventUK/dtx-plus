// Forcefully shows invisible buttons
// This fixes some browser compatibility issues
export default function fixMissingButtons() {
  document.querySelectorAll<HTMLButtonElement>('input[type="button"]').forEach((button) => {
    button.style.visibility = "visible";
  });
}

// Corrects input elements to use supported modern onchange handlers

// TODO not sure this is needed any more no onpropertychange on page

// export function fixInputEventHandlers() {
// 	document.querySelectorAll<HTMLInputElement>('input')
// 	.forEach(input => {
// 		const propertyChange = input.getAttribute("onpropertychange");
//         if (propertyChange) {

//             try {
//                 input.addEventListener('change', propertyChange);
//             } catch (e) {
//                 // Suppress errors
//             }

//             input.setAttribute('onchange', propertyChange);
//         }
// 	});
// }
