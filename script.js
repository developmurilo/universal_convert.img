const imageInput = document.getElementById('imageInput');
const formatSelect = document.getElementById('formatSelect');
const qualityContainer = document.getElementById('qualityContainer');
const qualityRange = document.getElementById('qualityRange');
const qualityValue = document.getElementById('qualityValue');
const convertButton = document.getElementById('convertButton');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const canvas = document.getElementById('canvas');
const downloadLink = document.getElementById('downloadLink');
const loadingIndicator = document.getElementById('loadingIndicator');
const successMessage = document.getElementById('successMessage');

// Atualiza o valor da qualidade ao mover o slider
qualityRange.addEventListener('input', () => {
  qualityValue.textContent = `${qualityRange.value}%`;
});

// Mostra a pré-visualização da imagem
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];

  if (file) {
    const fileURL = URL.createObjectURL(file);
    imagePreview.src = fileURL;
    previewContainer.style.display = 'block';
  }
});

// Mostra ou oculta o controle de qualidade
formatSelect.addEventListener('change', () => {
  const format = formatSelect.value;
  qualityContainer.style.display = format === 'jpeg' || format === 'webp' ? 'block' : 'none';
});

// Realiza a conversão
convertButton.addEventListener('click', () => {
  if (imageInput.files.length === 0) {
    alert('Por favor, envie uma imagem!');
    return;
  }

  const file = imageInput.files[0];
  const format = formatSelect.value;
  const quality = qualityRange.value / 100; // Qualidade em escala de 0 a 1
  const img = new Image();

  // Mostrar o indicador de carregamento
  loadingIndicator.style.display = 'block';
  successMessage.style.display = 'none';

  img.onload = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    let mimeType = '';
    if (format === 'jpeg') mimeType = 'image/jpeg';
    else if (format === 'png') mimeType = 'image/png';
    else if (format === 'webp') mimeType = 'image/webp';
    else if (format === 'bmp') mimeType = 'image/bmp';

    const convertedData = canvas.toDataURL(mimeType, format === 'jpeg' || format === 'webp' ? quality : undefined);
    downloadLink.href = convertedData;
    downloadLink.download = `imagem_convertida.${format}`;
    downloadLink.style.display = 'inline-block';
    downloadLink.textContent = 'Baixar Imagem Convertida';

    // Ocultar o indicador de carregamento e mostrar a mensagem de sucesso
    loadingIndicator.style.display = 'none';
    successMessage.style.display = 'block';
  };

  img.onerror = () => {
    loadingIndicator.style.display = 'none';
    alert('Erro ao carregar a imagem. Por favor, envie um arquivo de imagem válido.');
  };

  img.src = URL.createObjectURL(file);
});
