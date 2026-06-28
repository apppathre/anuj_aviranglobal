const productOfferedOptions = [
  'Coffee',
  'Cardamom & Spices',
  'Handloom Products',
  'Dehydrated Foods',
  'Agricultural Commodities'
];

function populateProductOfferedOptions() {
  const productSelects = document.querySelectorAll('select[data-product-offered-select]');
  if (!productSelects.length) {
    return;
  }

  productSelects.forEach((select) => {
    const selectedValue = select.value;

    // Preserve the first placeholder option and rebuild product choices from one source.
    select.innerHTML = '<option value="">Select</option>';

    productOfferedOptions.forEach((optionText) => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      select.appendChild(option);
    });

    if (selectedValue && productOfferedOptions.includes(selectedValue)) {
      select.value = selectedValue;
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateProductOfferedOptions);
} else {
  populateProductOfferedOptions();
}
