const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { thread } = useCasePayload;
    await this._threadRepository.verifyThreadIsExist(thread);
    const threadDetail = await this._threadRepository.getThreadById(thread);
    threadDetail.comments = await this._commentRepository.getCommentsThread(thread);
    return threadDetail;
  }
}

module.exports = GetThreadDetailUseCase;
