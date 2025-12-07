import { IssuesService } from '../services/issues.service.js'

export const IssuesController = {
  async report(req, res) {
    try {
      const { itemId, description, severity } = req.body
      if (!itemId || !description) return res.status(400).json({ message: 'Item and description required' })
      const issue = await IssuesService.report(req.user.sub, { itemId, description, severity })
      res.status(201).json(issue)
    } catch (e) {
      res.status(400).json({ message: e.message })
    }
  }
}
