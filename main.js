var TAX_RATE = parseFloat($('#config_tax_rate').val());
var TAX_SETTING = false;
let productCode = 4; // Iniciamos el contador del código de producto en 4

$('body').addClass('hidetax hidenote hidedate');

function init_date() {
  var now = new Date();
  var month = (now.getMonth() + 1);
  var day = now.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  var today = day + '-' + month + '-' + now.getFullYear().toString().substr(2, 2);

  var intwoweeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  var month = (intwoweeks.getMonth() + 1);
  var day = intwoweeks.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }

  var twoweeks = day + '-' + month + '-' + intwoweeks.getFullYear().toString().substr(2, 2);

  $('.datePicker').val(today);
  $('.twoweeks').val(twoweeks);
}

function calculate() {
  var total_price = 0,
    total_tax = 0;

  console.log('CALCULATING - Tax Rate:' + TAX_RATE);

  $('.invoicelist-body tbody tr').each(function () {
    var row = $(this),
      rate = row.find('.rate input').val(),
      amount = row.find('.amount input').val();

    var sum = rate * amount;
    var tax = ((sum / (TAX_RATE + 100)) * TAX_RATE);

    total_price = total_price + sum;
    total_tax = total_tax + tax;

    row.find('.sum').text(sum.toFixed(2));
    row.find('.tax').text(tax.toFixed(2));
  });

  $('#total_price').text(total_price.toFixed(2));
  $('#total_tax').text(total_tax.toFixed(2));
}

$('.invoicelist-body').on('keyup', 'input', function () {
  calculate();
});

// Incremento del código de producto al agregar una nueva fila
$('.newRow').on('click', function (e) {
  productCode++; // Incrementa el código del producto
  const paddedCode = String(productCode).padStart(5, '0'); // Formatear el código con ceros

  // Nueva fila con código secuencial
  var newRow = `
    <tr>
      <td><a class="control removeRow" href="#">x</a><span contenteditable>${paddedCode}</span></td>
      <td><span contenteditable>Descripción</span></td>
      <td class="amount"><input type="text" value="1"/></td>
      <td class="rate"><input type="text" value="99" /></td>
      <td class="tax taxrelated"></td>
      <td class="sum"></td>
    </tr>`;

  // Añadir la nueva fila al cuerpo de la tabla
  $('.invoicelist-body tbody').append(newRow);
  
  e.preventDefault();
  calculate(); // Recalcular después de agregar la fila
});

// Eliminar fila de la lista de productos
$('body').on('click', '.removeRow', function (e) {
  $(this).closest('tr').remove();
  e.preventDefault();
  calculate();
});

// Cambiar la configuración de notas
$('#config_note').on('change', function () {
  $('body').toggleClass('shownote hidenote');
});

// Cambiar la configuración de impuestos
$('#config_tax').on('change', function () {
  TAX_SETTING = !TAX_SETTING;
  $('body').toggleClass('showtax hidetax');
});

// Cambio de la tasa de impuestos
$('#config_tax_rate').on('keyup', function () {
  TAX_RATE = parseFloat($(this).val());
  if (TAX_RATE < 0 || TAX_RATE > 100) {
    TAX_RATE = 0;
    alert('Por favor ingresa una tasa de impuestos válida (entre 0 y 100)');
  }
  console.log('Changed tax rate to: ' + TAX_RATE);
  calculate();
});

// Mostrar o esconder la fecha
$('#config_date').on('change', function () {
  $('body').toggleClass('hidedate showdate');
});

// Inicializar la fecha
init_date();

// Calcular los totales al cargar la página
calculate();
