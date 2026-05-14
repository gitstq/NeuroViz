/**
 * NeuroViz - Model Definitions
 * Defines the architecture layers for different model types
 */

const NeuroVizModels = (() => {
    'use strict';

    /**
     * Transformer (GPT-2 Style) Architecture
     * Decoder-only transformer with causal attention
     */
    const TransformerModel = {
        name: 'Transformer (GPT-2 Style)',
        type: 'transformer',
        description: 'Decoder-only Transformer with multi-head causal self-attention, layer normalization, and position-wise feedforward networks.',
        paper: 'Attention Is All You Need (Vaswani et al., 2017)',
        params: {
            vocabSize: 50257,
            contextLength: 1024,
            embeddingDim: 768,
            numHeads: 12,
            numLayers: 12,
            ffnDim: 3072,
        },
        layers: [
            {
                id: 'input',
                name: 'Input Tokens',
                type: 'input',
                description: 'Raw text is tokenized into subword tokens using Byte-Pair Encoding (BPE). Each token is mapped to an integer ID from the vocabulary.',
                params: { vocabSize: 50257, tokenizer: 'BPE' },
                outputShape: '[batch, seq_len]',
            },
            {
                id: 'token_embedding',
                name: 'Token Embedding',
                type: 'embedding',
                description: 'Each token ID is looked up in a learned embedding matrix to produce a dense vector representation. These embeddings capture semantic relationships between tokens.',
                params: { dim: 768, vocabSize: 50257 },
                outputShape: '[batch, seq_len, 768]',
            },
            {
                id: 'position_embedding',
                name: 'Position Embedding',
                type: 'position',
                description: 'Since Transformers process all tokens in parallel, positional information is added via learned position embeddings. This tells the model the order of tokens.',
                params: { maxLength: 1024, dim: 768 },
                outputShape: '[batch, seq_len, 768]',
            },
            {
                id: 'embed_dropout',
                name: 'Embedding Dropout',
                type: 'dropout',
                description: 'Randomly zeros out some embedding values during training to prevent overfitting. This is a regularization technique.',
                params: { rate: 0.1 },
                outputShape: '[batch, seq_len, 768]',
            },
            ...generateTransformerBlocks(12, 768, 12, 3072),
            {
                id: 'final_ln',
                name: 'Final Layer Norm',
                type: 'normalization',
                description: 'A final layer normalization is applied before the output projection to stabilize the predictions.',
                params: { dim: 768 },
                outputShape: '[batch, seq_len, 768]',
            },
            {
                id: 'lm_head',
                name: 'LM Head (Output)',
                type: 'output',
                description: 'Projects the final hidden states to vocabulary-sized logits using a learned linear transformation (tied with token embeddings in GPT-2).',
                params: { inputDim: 768, outputDim: 50257 },
                outputShape: '[batch, seq_len, 50257]',
            },
            {
                id: 'softmax',
                name: 'Softmax',
                type: 'output',
                description: 'Converts raw logits to probabilities over the vocabulary using the softmax function. The highest probability token is typically selected as the prediction.',
                params: { temperature: 1.0 },
                outputShape: '[batch, seq_len, 50257]',
            },
        ],
    };

    /**
     * BERT Encoder Architecture
     */
    const BERTModel = {
        name: 'BERT Encoder',
        type: 'bert',
        description: 'Bidirectional Encoder Representations from Transformers. Uses bidirectional self-attention to capture context from both directions.',
        paper: 'BERT: Pre-training of Deep Bidirectional Transformers (Devlin et al., 2019)',
        params: {
            vocabSize: 30522,
            contextLength: 512,
            embeddingDim: 768,
            numHeads: 12,
            numLayers: 12,
            ffnDim: 3072,
        },
        layers: [
            {
                id: 'input',
                name: 'Input Tokens',
                type: 'input',
                description: 'Raw text is tokenized using WordPiece tokenization. Special [CLS] and [SEP] tokens are added for classification and segment separation.',
                params: { vocabSize: 30522, tokenizer: 'WordPiece' },
                outputShape: '[batch, seq_len]',
            },
            {
                id: 'token_embedding',
                name: 'Token Embedding',
                type: 'embedding',
                description: 'Each token is mapped to a dense vector via a learned embedding table.',
                params: { dim: 768, vocabSize: 30522 },
                outputShape: '[batch, seq_len, 768]',
            },
            {
                id: 'segment_embedding',
                name: 'Segment Embedding',
                type: 'embedding',
                description: 'BERT uses segment embeddings to distinguish between two sentences in tasks like Next Sentence Prediction.',
                params: { numSegments: 2, dim: 768 },
                outputShape: '[batch, seq_len, 768]',
            },
            {
                id: 'position_embedding',
                name: 'Position Embedding',
                type: 'position',
                description: 'Learned positional embeddings encode the position of each token in the sequence.',
                params: { maxLength: 512, dim: 768 },
                outputShape: '[batch, seq_len, 768]',
            },
            ...generateTransformerBlocks(12, 768, 12, 3072, 'bidirectional'),
            {
                id: 'pooler',
                name: 'Pooler',
                type: 'output',
                description: 'Takes the [CLS] token representation and passes it through a dense layer with tanh activation for classification tasks.',
                params: { inputDim: 768, outputDim: 768 },
                outputShape: '[batch, 768]',
            },
        ],
    };

    /**
     * CNN Classifier Architecture
     */
    const CNNModel = {
        name: 'CNN Text Classifier',
        type: 'cnn',
        description: 'Convolutional Neural Network for text classification. Uses multiple filter sizes to capture n-gram features at different scales.',
        paper: 'Convolutional Neural Networks for Sentence Classification (Kim, 2014)',
        params: {
            vocabSize: 10000,
            embeddingDim: 128,
            numFilters: 100,
            filterSizes: [3, 4, 5],
            numClasses: 2,
            dropoutRate: 0.5,
        },
        layers: [
            {
                id: 'input',
                name: 'Input Tokens',
                type: 'input',
                description: 'Text is tokenized and padded to a fixed length. Each token is represented by its vocabulary index.',
                params: { vocabSize: 10000, maxLength: 256 },
                outputShape: '[batch, 256]',
            },
            {
                id: 'embedding',
                name: 'Embedding Layer',
                type: 'embedding',
                description: 'Token indices are mapped to dense word vectors. Pre-trained embeddings (GloVe, Word2Vec) can be used for better performance.',
                params: { dim: 128, vocabSize: 10000, pretrained: 'optional' },
                outputShape: '[batch, 256, 128]',
            },
            {
                id: 'conv3',
                name: 'Conv1D (filter=3)',
                type: 'feedforward',
                description: 'A 1D convolution with filter size 3 captures trigram features (3-word phrases). This helps identify local patterns like "not good" or "very happy".',
                params: { filters: 100, kernelSize: 3, activation: 'ReLU' },
                outputShape: '[batch, 254, 100]',
            },
            {
                id: 'conv4',
                name: 'Conv1D (filter=4)',
                type: 'feedforward',
                description: 'A 1D convolution with filter size 4 captures 4-gram features for slightly longer phrase patterns.',
                params: { filters: 100, kernelSize: 4, activation: 'ReLU' },
                outputShape: '[batch, 253, 100]',
            },
            {
                id: 'conv5',
                name: 'Conv1D (filter=5)',
                type: 'feedforward',
                description: 'A 1D convolution with filter size 5 captures 5-gram features for longer contextual patterns.',
                params: { filters: 100, kernelSize: 5, activation: 'ReLU' },
                outputShape: '[batch, 252, 100]',
            },
            {
                id: 'pool',
                name: 'Global Max Pooling',
                type: 'pooling',
                description: 'Applies max pooling over the sequence dimension for each filter. This extracts the most important feature from each filter regardless of position.',
                params: { poolType: 'max' },
                outputShape: '[batch, 300]',
            },
            {
                id: 'concat',
                name: 'Concatenation',
                type: 'feedforward',
                description: 'The outputs from all filter sizes are concatenated into a single feature vector.',
                params: { inputDims: [100, 100, 100], outputDim: 300 },
                outputShape: '[batch, 300]',
            },
            {
                id: 'dropout',
                name: 'Dropout',
                type: 'dropout',
                description: 'Randomly drops 50% of neurons during training to prevent overfitting.',
                params: { rate: 0.5 },
                outputShape: '[batch, 300]',
            },
            {
                id: 'fc',
                name: 'Fully Connected',
                type: 'output',
                description: 'A dense layer maps the concatenated features to class logits for classification.',
                params: { inputDim: 300, outputDim: 2 },
                outputShape: '[batch, 2]',
            },
            {
                id: 'softmax',
                name: 'Softmax',
                type: 'output',
                description: 'Converts logits to class probabilities.',
                params: {},
                outputShape: '[batch, 2]',
            },
        ],
    };

    /**
     * RNN Sequence Model Architecture
     */
    const RNNModel = {
        name: 'RNN Sequence Model',
        type: 'rnn',
        description: 'Recurrent Neural Network with LSTM cells for sequence processing. Processes tokens sequentially, maintaining a hidden state that carries information forward.',
        paper: 'Long Short-Term Memory (Hochreiter & Schmidhuber, 1997)',
        params: {
            vocabSize: 10000,
            embeddingDim: 128,
            hiddenDim: 256,
            numLayers: 2,
            numClasses: 10000,
            dropoutRate: 0.3,
        },
        layers: [
            {
                id: 'input',
                name: 'Input Tokens',
                type: 'input',
                description: 'Text is tokenized and each token is mapped to its vocabulary index.',
                params: { vocabSize: 10000 },
                outputShape: '[batch, seq_len]',
            },
            {
                id: 'embedding',
                name: 'Embedding Layer',
                type: 'embedding',
                description: 'Token indices are mapped to dense word vectors that capture semantic meaning.',
                params: { dim: 128, vocabSize: 10000 },
                outputShape: '[batch, seq_len, 128]',
            },
            {
                id: 'lstm1',
                name: 'LSTM Layer 1',
                type: 'feedforward',
                description: 'First LSTM layer processes the sequence step by step. The LSTM cell uses gates (input, forget, output) to control information flow, solving the vanishing gradient problem.',
                params: { inputDim: 128, hiddenDim: 256, returnSequences: true },
                outputShape: '[batch, seq_len, 256]',
            },
            {
                id: 'dropout1',
                name: 'Dropout',
                type: 'dropout',
                description: 'Regularization between LSTM layers.',
                params: { rate: 0.3 },
                outputShape: '[batch, seq_len, 256]',
            },
            {
                id: 'lstm2',
                name: 'LSTM Layer 2',
                type: 'feedforward',
                description: 'Second LSTM layer captures higher-level sequential patterns. Stacked LSTMs learn increasingly abstract representations.',
                params: { inputDim: 256, hiddenDim: 256, returnSequences: true },
                outputShape: '[batch, seq_len, 256]',
            },
            {
                id: 'dropout2',
                name: 'Dropout',
                type: 'dropout',
                description: 'Regularization after the second LSTM layer.',
                params: { rate: 0.3 },
                outputShape: '[batch, seq_len, 256]',
            },
            {
                id: 'fc',
                name: 'Fully Connected',
                type: 'output',
                description: 'Maps LSTM hidden states to vocabulary-sized logits for next-token prediction.',
                params: { inputDim: 256, outputDim: 10000 },
                outputShape: '[batch, seq_len, 10000]',
            },
            {
                id: 'softmax',
                name: 'Softmax',
                type: 'output',
                description: 'Converts logits to probability distribution over the vocabulary.',
                params: {},
                outputShape: '[batch, seq_len, 10000]',
            },
        ],
    };

    /**
     * Generate transformer block layers
     */
    function generateTransformerBlocks(numLayers, dim, numHeads, ffnDim, attentionType = 'causal') {
        const layers = [];
        for (let i = 0; i < numLayers; i++) {
            const blockLabel = numLayers > 6 ? `${i + 1}` : `${i + 1}`;
            layers.push(
                {
                    id: `ln1_${i}`,
                    name: `Layer Norm ${blockLabel}a`,
                    type: 'normalization',
                    description: `Pre-normalization before attention in transformer block ${i + 1}. Normalizes the input to have zero mean and unit variance, stabilizing training.`,
                    params: { dim, eps: 1e-5 },
                    outputShape: `[batch, seq_len, ${dim}]`,
                    blockIndex: i,
                },
                {
                    id: `attn_${i}`,
                    name: `Multi-Head Attention ${blockLabel}`,
                    type: 'attention',
                    description: `${attentionType === 'causal' ? 'Causal (masked) self-attention' : 'Bidirectional self-attention'} with ${numHeads} heads. Each head learns to attend to different aspects of the input. ${attentionType === 'causal' ? 'A causal mask prevents attending to future tokens.' : 'Attends to all positions bidirectionally.'}`,
                    params: { dim, numHeads, headDim: dim / numHeads, attentionType },
                    outputShape: `[batch, seq_len, ${dim}]`,
                    blockIndex: i,
                },
                {
                    id: `res1_${i}`,
                    name: `Residual ${blockLabel}a`,
                    type: 'residual',
                    description: `Residual connection adds the attention output back to the input. This helps with gradient flow and allows training very deep networks.`,
                    params: {},
                    outputShape: `[batch, seq_len, ${dim}]`,
                    blockIndex: i,
                },
                {
                    id: `ln2_${i}`,
                    name: `Layer Norm ${blockLabel}b`,
                    type: 'normalization',
                    description: `Pre-normalization before the feedforward network in block ${i + 1}.`,
                    params: { dim, eps: 1e-5 },
                    outputShape: `[batch, seq_len, ${dim}]`,
                    blockIndex: i,
                },
                {
                    id: `ffn_${i}`,
                    name: `Feed-Forward ${blockLabel}`,
                    type: 'feedforward',
                    description: `Position-wise feedforward network: two linear transformations with GELU activation. Expands from ${dim} to ${ffnDim} dimensions and back. This allows the model to learn complex transformations at each position.`,
                    params: { inputDim: dim, hiddenDim: ffnDim, activation: 'GELU' },
                    outputShape: `[batch, seq_len, ${dim}]`,
                    blockIndex: i,
                },
                {
                    id: `res2_${i}`,
                    name: `Residual ${blockLabel}b`,
                    type: 'residual',
                    description: `Second residual connection adds the feedforward output back to the input of this sub-block.`,
                    params: {},
                    outputShape: `[batch, seq_len, ${dim}]`,
                    blockIndex: i,
                }
            );
        }
        return layers;
    }

    /**
     * Get all available models
     */
    function getModels() {
        return {
            transformer: TransformerModel,
            bert: BERTModel,
            cnn: CNNModel,
            rnn: RNNModel,
        };
    }

    /**
     * Get model by type
     */
    function getModel(type) {
        const models = getModels();
        return models[type] || models.transformer;
    }

    /**
     * Get simplified layer list (for models with many repeated blocks)
     */
    function getSimplifiedLayers(model) {
        if (model.type === 'transformer' || model.type === 'bert') {
            // Show first block in detail, then summarize remaining
            const simplified = [];
            let blockCount = 0;
            let inBlock = false;

            for (const layer of model.layers) {
                if (layer.blockIndex !== undefined) {
                    if (layer.blockIndex === 0 && !inBlock) {
                        simplified.push(layer);
                        inBlock = true;
                    } else if (layer.blockIndex === 0 && inBlock) {
                        blockCount++;
                    }
                } else {
                    if (inBlock && blockCount > 0) {
                        simplified.push({
                            id: 'more_blocks',
                            name: `... ${model.params.numLayers - 1} more blocks`,
                            type: 'attention',
                            description: `The pattern above repeats ${model.params.numLayers - 1} more times.`,
                            params: {},
                            outputShape: `[batch, seq_len, ${model.params.embeddingDim}]`,
                            isCollapsed: true,
                        });
                        inBlock = false;
                        blockCount = 0;
                    }
                    simplified.push(layer);
                }
            }
            return simplified;
        }
        return model.layers;
    }

    return {
        getModels,
        getModel,
        getSimplifiedLayers,
    };
})();
