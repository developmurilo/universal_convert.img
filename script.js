// Seleciona os elementos HTML necessários para interagir com o usuário
const imageInput = document.getElementById('imageInput'); // Input para envio de imagens
const formatSelect = document.getElementById('formatSelect'); // Seleção de formato para conversão
const qualityContainer = document.getElementById('qualityContainer'); // Contêiner para opções de qualidade
const qualityRange = document.getElementById('qualityRange'); // Slider para ajustar a qualidade
const qualityValue = document.getElementById('qualityValue'); // Exibição do valor da qualidade
const convertButton = document.getElementById('convertButton'); // Botão para iniciar a conversão
const previewContainer = document.getElementById('previewContainer'); // Contêiner para exibição de pré-visualização
const imagePreview = document.getElementById('imagePreview'); // Elemento para exibir a pré-visualização da imagem
const canvas = document.getElementById('canvas'); // Canvas para processar a imagem
const downloadLink = document.getElementById('downloadLink'); // Link para baixar a imagem convertida
const loadingIndicator = document.getElementById('loadingIndicator'); // Indicador de carregamento durante a conversão
const successMessage = document.getElementById('successMessage'); // Mensagem de sucesso após a conversão

// Atualiza o texto exibido com o valor do slider de qualidade quando ele é ajustado
qualityRange.addEventListener('input', () => {
  qualityValue.textContent = `${qualityRange.value}%`; // Mostra a qualidade como porcentagem
});

// Mostra a pré-visualização da imagem enviada pelo usuário
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0]; // Obtém o arquivo enviado pelo usuário

  if (file) {
    const fileURL = URL.createObjectURL(file); // Cria uma URL para exibir a imagem
    imagePreview.src = fileURL; // Define o src da imagem de pré-visualização
    previewContainer.style.display = 'block'; // Torna visível o contêiner de pré-visualização
  }
});

// Mostra ou oculta o controle de qualidade baseado no formato selecionado
formatSelect.addEventListener('change', () => {
  const format = formatSelect.value; // Obtém o formato selecionado
  // Exibe o controle de qualidade apenas para formatos que suportam compressão
  qualityContainer.style.display = format === 'jpeg' || format === 'webp' ? 'block' : 'none';
});

// Lida com a lógica de conversão da imagem
convertButton.addEventListener('click', () => {
  // Verifica se alguma imagem foi enviada
  if (imageInput.files.length === 0) {
    alert('Por favor, envie uma imagem!'); // Exibe um alerta caso não haja imagem
    return;
  }

  const file = imageInput.files[0]; // Obtém o arquivo enviado
  const format = formatSelect.value; // Obtém o formato selecionado
  const quality = qualityRange.value / 100; // Converte a qualidade para uma escala de 0 a 1
  const img = new Image(); // Cria um novo elemento de imagem

  // Mostra o indicador de carregamento enquanto a imagem está sendo processada
  loadingIndicator.style.display = 'block';
  successMessage.style.display = 'none';

  // Processa a imagem quando ela é carregada
  img.onload = () => {
    const ctx = canvas.getContext('2d'); // Obtém o contexto de desenho do canvas
    canvas.width = img.width; // Define a largura do canvas com base na imagem
    canvas.height = img.height; // Define a altura do canvas com base na imagem

    ctx.drawImage(img, 0, 0); // Desenha a imagem no canvas

    // Define o tipo MIME com base no formato selecionado
    let mimeType = '';
    if (format === 'jpeg') mimeType = 'image/jpeg';
    else if (format === 'png') mimeType = 'image/png';
    else if (format === 'webp') mimeType = 'image/webp';
    else if (format === 'bmp') mimeType = 'image/bmp';

    // Converte a imagem para o formato e qualidade selecionados
    const convertedData = canvas.toDataURL(
      mimeType,
      format === 'jpeg' || format === 'webp' ? quality : undefined
    );

    // Prepara o link para download da imagem convertida
    downloadLink.href = convertedData; // Define o href com os dados da imagem convertida
    downloadLink.download = `imagem_convertida.${format}`; // Define o nome do arquivo
    downloadLink.style.display = 'inline-block'; // Torna o link visível
    downloadLink.textContent = 'Baixar Imagem Convertida'; // Define o texto do link

    // Oculta o indicador de carregamento e exibe a mensagem de sucesso
    loadingIndicator.style.display = 'none';
    successMessage.style.display = 'block';
  };

  // Trata erros ao carregar a imagem
  img.onerror = () => {
    loadingIndicator.style.display = 'none'; // Oculta o indicador de carregamento
    alert('Erro ao carregar a imagem. Por favor, envie um arquivo de imagem válido.'); // Mostra um alerta
  };

  // Define a URL da imagem para carregamento
  img.src = URL.createObjectURL(file);
});
