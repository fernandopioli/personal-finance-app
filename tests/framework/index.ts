import { JestAdapter } from '@tests/framework/JestAdapter'
import { DomainAssertions } from '@tests/framework/DomainAssertions'
import { TestAdapter } from '@tests/framework/TestAdapter'

export { TestAdapter, JestAdapter, DomainAssertions }

export const domainAssert = new DomainAssertions(new JestAdapter())
