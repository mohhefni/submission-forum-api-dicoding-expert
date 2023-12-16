class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const threadId = useCasePayload;
    await this._threadRepository.verifyThreadIsExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsThread(threadId);
    return { ...thread, comments };
  }
}

module.exports = GetThreadDetailUseCase;
